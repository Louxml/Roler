

import { ExtensionType } from "../../../../extensions/index.js";
import { System } from "../../shared/system/System.js";
import { Texture } from "../../shared/texture/Texture.js";
import { GLTexture } from "./GLTexture.js";
import { COMPARE_MODES, MIPMAP_SCALE_MODES, SCALE_MODES, WARP_MODES } from "./const.js";
import { glUploadBufferResource } from "./uploaders/glUploadBufferResource.js";
import { glUploadImageResource } from "./uploaders/glUploadImageResource.js";
import { glUploadVideoResource } from "./uploaders/glUploadVideoResource.js";
import { glUploadCompressedTextureResource } from "./uploaders/glUploadCompressedTextureResource.js";
import { mapFormatToGLFormat, mapFormatToGLInternalFormat, mapFormatToGLType } from "./utils/mapFormat.js";

// 每个像素的字节数
const BYTES_PER_PIXEL = 4;


export class GLTextureSystem extends System {
    
    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'texture'
    }

    #gl;

    /** 支持最大纹理数量 */
    #maxTextures;
    /** 纹理绑定位置对应纹理 */
    #boundTextures = [];
    /** 当前纹理激活位置 */
    #activeLocation = -1;
    /** source生成glTexture哈希表，避免重复生成 */
    #glTextures = Object.create(null);

    /** TODO 是否使用单独的采样器 */
    #useSeparateSamplers = false;

    #mapFormatToInternalFormat;
    #mapFormatToType;
    #mapFormatToFormat;

    /** 管理中的glTexture纹理，已经注册过事件的glTexture */
    #managedTextures = [];

    /** 不同类型的纹理上传方法 */
    #uploads = {
        image: glUploadImageResource,
        buffer: glUploadBufferResource,
        video: glUploadVideoResource,
        compressed: glUploadCompressedTextureResource
    };


    init(){
        console.log('GLTextureSystem init');
    }

    contextChange(gl){
        this.#gl = gl;

        this.#mapFormatToInternalFormat ??= mapFormatToGLInternalFormat(gl, this.renderer.context.extensions);
        this.#mapFormatToType ??= mapFormatToGLType(gl);
        this.#mapFormatToFormat ??= mapFormatToGLFormat(gl);

        this.#maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);

        this.#glTextures = Object.create(null);
        
        for (let i = 0; i < this.#maxTextures; i++){
            this.bind(Texture.EMPTY, i)
        }

        // Test
        // this.getPixels(Texture.EMPTY);
        this.bind(Texture.WHITE)
    }

    initSource(source){
        this.bind(source);
    }

    /**
     * 绑定纹理在指定位置上
     * @param {Texture} texture 纹理
     * @param {Number} location 位置
     */
    bind(texture, location = 0){
        const source = texture.source;
        
        if (texture){
            this.bindSource(source, location);
            // TODO 单独采样器
        }else{
            this.bindSource(null, location);
            // TODO 单独采样器
        }

    }

    /**
     * 绑定纹理源在指定位置上
     * @param {TextureSource} source 纹理源
     * @param {Number} location 位置
     * @returns 
     */
    bindSource(source, location = 0){
        const gl = this.#gl;

        // TODO 这里使用了source.touched， 用于纹理垃圾回收

        if (this.#boundTextures[location] === source) return;

        this.#boundTextures[location] = source;
        this.#activateLocation(location);

        source ??= Texture.EMPTY.source;
        
        const glTexture = this.getGLSource(source);

        gl.bindTexture(glTexture.target, glTexture.texture);

        // TODO 纹理本身是不知道绑定点的，自身更新时，都是绑定当前激活点，是否可优化？
    }

    /**
     * 解绑纹理
     * @param {Texture} texture 纹理
     */
    unbind(texture){
        const source = texture.source;
        const gl = this.#gl;
        const boundTexture = this.#boundTextures;

        for (let i = 0; i < this.#maxTextures; i++){
            if (boundTexture[i] === source){
                // 激活当前位置
                this.#activateLocation(i);
                const glTexture = this.#glTextures[source.uid];
                gl.bindTexture(glTexture.target, null);
                boundTexture[i] = null;
            }
        }

    }

    /**
     * 
     * @param {TextureSource} source 纹理源
     * @param {*} firstCreation 跳过与默认值相同的配置设置
     */
    updateStyle(source, firstCreation){
        const gl = this.#gl;
        const glTexture = this.getGLSource(source);

        // 绑定到当前激活点上处理纹理
        this.#boundTextures[this.#activeLocation] = source;
        gl.bindTexture(glTexture.target, glTexture.texture);


        this.#applyStyleParams(
            source.style,
            source.mipLevelCount > 1,
            this.renderer.context.extensions.anisotropicFiltering,
            'texParameteri',
            gl.TEXTURE_2D,
            !this.renderer.context.supports.nonPowOf2wrapping && !source.isPowerOfTwo,
            firstCreation
        );
    }

    /**
     * 获取GLTexture对象
     * @param {TextureSource} source 纹理源
     * @returns {GLTexture} 纹理
     */
    getGLSource(source){
        return this.#glTextures[source.uid] ?? this.#createGLTexture(source);
    }

    /**
     * 创建GLTexture对象
     * @param {TextureSource} source 纹理源
     * @returns {GLTexture} 纹理
     */
    #createGLTexture(source){
        const gl = this.#gl;

        const glTexture = new GLTexture(gl.createTexture());

        glTexture.type = this.#mapFormatToType[source.format];
        glTexture.internalFormat = this.#mapFormatToInternalFormat[source.format];
        glTexture.format = this.#mapFormatToFormat[source.format];

        // TODO 自动mipmap
        if (source.autoGenerateMipmaps && (source.isPowerOfTwo || this.renderer.context.supports.nonPowOf2mipmaps)){
            // 最长边
            const max = Math.max(source.width, source.height);
            source.mipLevelCount = Math.floor(Math.log2(max)) + 1;
        }

        this.#glTextures[source.uid] = glTexture;

        if (!this.#managedTextures.includes(source)){
            source.on('update', this.#onSourceUpdate, this);
            source.on('resize', this.#onSourceUpdate, this);
            source.on('styleChange', this.#onStyleChange, this);
            source.on('destroy', this.#onSourceDestroy, this);
            source.on('unload', this.#onSourceUnload, this);
            source.on('updateMipmaps', this.#onUpdateMipmaps, this);

            this.#managedTextures.push(source);
        }
        
        this.#onSourceUpdate(source);
        this.updateStyle(source, false);

        return glTexture;
    }

    /**
     * 上传纹理数据至GPU，如果开启mipmap，则重新自动生成mipmap
     * @param {TextureSource} source 纹理源
     */
    #onSourceUpdate(source){
        const gl = this.#gl;
        const glTexture = this.getGLSource(source);

        // 修改当前绑定点的纹理，在当前绑定点操作
        this.#boundTextures[this.#activeLocation] = source;
        gl.bindTexture(glTexture.target, glTexture.texture);

        const uploader = this.#uploads[source.uploadMethodId];

        if (uploader){
            uploader.upload(source, glTexture, gl, this.renderer.context.webGLVersion);
        }else{
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, source.pixelWidth, source.pixelHeight, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }

        if (source.autoGenerateMipmaps && source.mipLevelCount > 1){
            this.#onUpdateMipmaps(source, false);
        }

    }

    /**
     * 如果纹理源的配置发生改变，则重新设置纹理配置
     * @param {TextureSource} source 纹理源
     */
    #onStyleChange(source){
        this.updateStyle(source, false);
    }

    /**
     * 纹理源销毁，移除纹理
     * @param {TextureSource} source 纹理源
     */
    #onSourceDestroy(source){
        source.off('destroy', this.#onSourceDestroy, this);
        source.off('update', this.#onSourceUpdate, this);
        source.off('resize', this.#onSourceUpdate, this);
        source.off('unload', this.#onSourceUnload, this);
        source.off('styleChange', this.#onStyleChange, this);
        source.off('updateMipmaps', this.#onUpdateMipmaps, this);

        // 从管理列表中移除
        this.#managedTextures.splice(this.#managedTextures.indexOf(source), 1);

        // 从GPU中移除纹理
        this.deleteSource(source);
    }

    /**
     * 从GPU移除纹理
     * @param {TextureSource} source 纹理源
     * @returns 
     */
    #onSourceUnload(source){
        const glTexture = this.#glTextures[source.uid];
        if (!glTexture) return;

        this.unbind(source);
        this.#glTextures[source.uid] = null;

        this.#gl.deleteTexture(glTexture.texture);
    }

    /** 更新mipmap，重新生成mipmap */
    #onUpdateMipmaps(source, bind = true){
        // 是否需要重新绑定纹理，0位置处理纹理，否则在当前位置处理纹理
        if (bind) this.bindSource(source);

        const glTexture = this.getGLSource(source);
        const gl = this.#gl;

        gl.generateMipmap(glTexture.target);
    }

    /**
     * 激活纹理位置
     * @param {Number} location 纹理位置（索引）
     * @returns 
     */
    #activateLocation(location){
        if (this.#activeLocation === location) return;

        this.#gl.activeTexture(this.#gl.TEXTURE0 + location);
        this.#activeLocation = location;
    }

    /**
     * 应用纹理格式，纹理的配置
     * @param {TextureStyle} style 纹理格式对象
     * @param {Boolean} mipmaps 是否开启mipmap
     * @param {Object} anisotropicExt 各向异性拓展
     * @param {String} glFunctionName 纹理设置函数 'samplerParameteri' | 'texParameteri'。samplerParameteri是sampler的设置函数(WebGL2)，texParameteri是纹理的设置函数(WebGL1)
     * @param {Number} firstParam gl.TEXTURE_2D或者WebGLSampler。目标类型或者采样器（WebGL2）
     * @param {Boolean} forceClamp 强制clamp
     * @param {Boolean} firstCreation 是否是第一次创建？
     */
    #applyStyleParams(style, mipmaps, anisotropicExt, glFunctionName, firstParam, forceClamp, firstCreation){
        // const castParam = firstParam;
        // 1.设置纹理环绕模式
        if (!firstCreation || style.wrapModeU !== 'repeat' || style.wrapModeV !== 'repeat' || style.wrapModeW !== 'repear'){
            // x轴方向，横向
            const wrapModeS = WARP_MODES[forceClamp ? 'clamp-to-edge' : style.wrapModeU];
            // y轴方向，纵向
            const wrapModeT = WARP_MODES[forceClamp ? 'clamp-to-edge' : style.wrapModeV];
            // z轴方向，深度
            const wrapModeR = WARP_MODES[forceClamp ? 'clamp-to-edge' : style.wrapModeW];

            this.#gl[glFunctionName](firstParam, this.#gl.TEXTURE_WRAP_S, wrapModeS);
            this.#gl[glFunctionName](firstParam, this.#gl.TEXTURE_WRAP_T, wrapModeT);
            // webgl1 不支持
            if (this.#gl.TEXTURE_WRAP_R) this.#gl[glFunctionName](firstParam, this.#gl.TEXTURE_WRAP_R, wrapModeR);
        }

        // 2.设置纹理放大缩小模式
        if (!firstCreation || style.magFilter !== 'linear'){
            // 纹理放大
            const magFilter = SCALE_MODES[style.magFilter];
            this.#gl[glFunctionName](firstParam, this.#gl.TEXTURE_MAG_FILTER, magFilter);
        }

        if (mipmaps){
            if (!firstCreation || style.minFilter !== 'linear'){
                // mipmap纹理缩小
                const minFilter = MIPMAP_SCALE_MODES[style.mipmapFilter][style.minFilter];
                this.#gl[glFunctionName](firstParam, this.#gl.TEXTURE_MIN_FILTER, minFilter);
            }
        }else{
            // 纹理缩小
            const minFilter = SCALE_MODES[style.minFilter];
            this.#gl[glFunctionName](firstParam, this.#gl.TEXTURE_MIN_FILTER, minFilter);
        }

        // 3.设置各向异性
        if (anisotropicExt && style.maxAnisotropy > 1){
            const level = Math.min(style.maxAnisotropy, this.#gl.getParameter(anisotropicExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
            this.#gl[glFunctionName](firstParam, anisotropicExt.TEXTURE_MAX_ANISOTROPY_EXT, level);
        }

        // 4.设置纹理比较模式
        if (style.compare){
            // 这里是否需要启动比较模式，设置就自动启动？
            // this.#gl[glFunctionName](firstParam, this.#gl.TEXTURE_COMPARE_MODE, this.#gl.COMPARE_REF_TO_TEXTURE);
            const compare = COMPARE_MODES[style.compare];
            this.#gl[glFunctionName](firstParam, this.#gl.TEXTURE_COMPARE_FUNC, compare);
        }
    }

    /**
     * 将纹理对象生成Canvas
     * @param {Texture} texture 纹理对象
     */
    generateCanvas(texture){
        

    }

    /**
     * 获取纹理对象所有像素数据
     * @param {Texture} texture 纹理对象
     */
    getPixels(texture){
        const resolution = texture.source.resolution;
        const frame = texture.frame;

        const width = Math.max(Math.round(frame.width * resolution), 1);
        const height = Math.max(Math.round(frame.height * resolution), 1);

        const pixels = new Uint8Array(BYTES_PER_PIXEL * width * height);

        const renderer = this.renderer;

        console.log(renderer.renderTarget)
    }


    /** 子系统销毁生命周期 */
    destroy(){
        // 销毁所有管理纹理源
        this.#managedTextures.slice().forEach(source => this.#onSourceDestroy(source));
        this.#managedTextures = null;
    }


    get gl(){
        return this.#gl;
    }
}