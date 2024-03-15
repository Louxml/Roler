

import { BaseTexture, System, Texture } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";
import { GLTexture } from "./GLTexture.js";
import { MIPMAP_MODES, SCALE_MODES, WRAP_MODES } from "../../../constants/src/index.js";


export class TextureSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "texture",
        priority: 60
    }

    /**
     * 渲染器对象
     * @public
     */
    renderer;

    gl;

    CONTEXT_UID;

    /**
     * 绑定的纹理列表
     * @Array
     * @public
     */
    boundTextures;

    /**
     * 当前管理的Texture字典
     * @Object
     * @public
     */
    managedTextures;

    /**
     * 空纹理字典
     * @private
     */
    #emptyTextures;

    /**
     * 当前激活纹理单元位置
     * @Number
     * @private
     */
    #currentLocation;

    /**
     * 支持的最大纹理数量
     * @Number
     * @parivate
     */
    maxTextures;

    constructor(renderer){
        super();

        this.renderer = renderer;

        this.boundTextures = [];

        this.#emptyTextures = {};
        this.#currentLocation = -1;

        this.managedTextures = {}
    }

    /**
     * 子系统初始化生命周期
     */
    init(){
        console.log(`Texture System`);
    }

    /**
     * 子系统上下文环境改变生命周期
     */
    contextChange(){
        this.disposeAll(true);

        const gl = this.gl = this.renderer.gl;
        this.CONTEXT_UID  = this.renderer.CONTEXT_UID;

        // 初始化绑定纹理列表
        this.maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this.boundTextures.length = this.maxTextures;
        for (let i = 0; i < this.boundTextures.length; i++){
            this.boundTextures[i] = null;
        }

        // 初始化空白纹理
        this.initEmptyTextures();
        

        for (let i = 0; i < this.boundTextures.length; i++){
            this.bind(null,  i);
        }
    }

    /**
     * 初始化所有空纹理
     * @private
     */
    initEmptyTextures(){
        const { gl }  = this;
        // 空纹理
        this.#emptyTextures = {};

        this.#emptyTextures[gl.TEXTURE_2D] = new GLTexture(gl.createTexture());
        this.#emptyTextures[gl.TEXTURE_CUBE_MAP] = new GLTexture(gl.createTexture());

        // 纹理
        gl.bindTexture(gl.TEXTURE_2D, this.#emptyTextures[gl.TEXTURE_2D].texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
        
        // 立体纹理
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.#emptyTextures[gl.TEXTURE_CUBE_MAP].texture);
        for (let i = 0; i < 6; i++){
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    /**
     * 设置纹理位置，激活位置上的纹理
     * @param {Number} location 位置
     * @private
     */
    setLocation(location){
        const { gl } = this;

        // if (typeof location !== "number") return;

        // if (location < 0 || location >= this.maxTextures) return;

        if (this.#currentLocation !== location){
            gl.activeTexture(gl.TEXTURE0 + location);
            this.#currentLocation = location;
        }
    }

    /**
     * 绑定纹理在指定位置上
     * @param {Texture | BaseTexture} texture 绑定的纹理
     * @param {Number} location 绑定的位置，位置的范围取决于设备支持的最大激活纹理数量
     * @public
     */
    bind(texture, location = 0){
        const { gl } = this;

        texture = texture?.getBaseTexture();

        if (texture?.valid){

            const glTexture = texture.glTextures[this.CONTEXT_UID] || this.initTexture(texture);

            // 绑定纹理
            if (this.boundTextures[location]!== texture){
                this.setLocation(location);

                gl.bindTexture(texture.target, glTexture.texture);

                this.boundTextures[location] = texture;
            }

            // 检查更新纹理
            if (texture.updateID !== glTexture.updateID){
                this.setLocation(location);

                this.updateTexture(texture);
            }else if (texture.updateStyleID !== glTexture.updateStyleID){
                this.setLocation(location);

                this.updateTextureStyle(texture);
            }

        }else{
            // 这里只处理了TEXTURE2D的纹理
            this.setLocation(location);
            // 绑定空白纹理
            gl.bindTexture(gl.TEXTURE_2D, this.#emptyTextures[gl.TEXTURE_2D].texture);
            // 移除当前位置的纹理
            this.boundTextures[location] = null;
        }
    }

    /**
     * 解绑指定纹理
     * @param {Texture | BaseTexture} texture 解绑的纹理
     * @public
     */
    unbind(texture){
        const { gl, boundTextures } = this;

        texture = texture?.getBaseTexture();

        // TODO 未知纹理什么意思
        
        


        for (let i = 0; i < boundTextures.length; i++){
            if (boundTextures[i] === texture){
                this.setLocation(i);

                gl.bindTexture(texture.target, this.#emptyTextures[texture.target].texture);
                boundTextures[i] = null;
            }
        }
    }

    /**
     * 子系统重置生命周期
     * TODO 现在还没有地方调用到
     */
    reset(){
        
    }

    /**
     * 初始化纹理数据，并返回GLTexture对象
     * @private
     * @param {BaseTexture} texture 纹理
     * @returns {GLTexture} GLTexture
     */
    initTexture(texture){
        const { gl, CONTEXT_UID } = this;
        const glTexture =  new GLTexture(gl.createTexture());

        texture.glTextures[CONTEXT_UID] = glTexture;

        this.managedTextures[texture.id]=  texture;

        texture.disposeRunner.add(this);

        return glTexture
    }

    /**
     * 初始化纹理的类型
     * TOOD: texture.samplerType, texture.internalFormat, texture.type
     * @param {BaseTexture} texture 基础纹理
     * @param {GLTexture} glTexture glTexture对象
     * @private
     */
    initTextureType(texture, glTexture){

    }

    /**
     * 更新纹理
     * @param {BaseTexture} texture 基础纹理
     * @private
     */
    updateTexture(texture){
        const { renderer, CONTEXT_UID } = this;
        const glTexture = texture.glTextures[CONTEXT_UID];

        // this.initTextureType(texture, glTexture);

        if (texture.resource?.upload(renderer, texture, glTexture)){
            // 上传成功
        }else{
            // 上传失败，执行默认上传
            const width = texture.realWidth;
            const height = texture.realHeight;
            const gl = this.gl;

            if (glTexture.width !== width || glTexture.height !== height || glTexture.updateID < 0){
                glTexture.width = width;
                glTexture.height = height;

                gl.texImage2D(texture.target, 0, glTexture.internalFormat, width, height, 0, texture.format, glTexture.type, null);
            }
        }

        if (texture.updateStyleID !== glTexture.updateStyleID){
            this.updateTextureStyle(texture);
        }

        glTexture.updateID = texture.updateID;
    }

    /**
     * 更新纹理状态
     * @param {BaseTexture} texture 基础纹理
     * @private
     */
    updateTextureStyle(texture){
        const glTexture = texture.glTextures[this.CONTEXT_UID];

        // 设置mipmap
        glTexture.mipmap = ((texture.mipmap === MIPMAP_MODES.POW2 && texture.isPowOfTwo) || (texture.mipmap > 1 && this.webGLVersion === 2));

        // 设置wrapmode，边缘绘制模式
        glTexture.wrapMode = (!texture.isPowOfTwo && this.webGLVersion !== 2) ? WRAP_MODES.CLAMP : texture.wrapMode;

        if (texture.resource?.style(this.renderer, texture, glTexture)){

        }else{
            this.setStyle(texture, glTexture);
        }

        glTexture.updateStyleID = texture.updateStyleID;
    }

    /**
     * 设置状态
     * 如：纹理的边缘绘制模式、缩放模式
     * @param {BaseTexture} texture 基础纹理
     * @param {GLTexture} glTexture GLTexture对象
     */
    setStyle(texture, glTexture){
        const gl = this.gl;

        // TODO 这里没有处理MIPMAP_MODE.ON_MANUAL手动mipmap的情况
        if (glTexture.mipmap){
            // 生成mipmap
            gl.generateMipmap(texture.target);
        }

        // 设置纹理边缘绘制模式
        // 水平轴
        gl.texParameteri(texture.target, gl.TEXTURE_WRAP_S, glTexture.wrapMode);
        // 垂直轴
        gl.texParameteri(texture.target, gl.TEXTURE_WRAP_T, glTexture.wrapMode);

        // 设置缩放模式
        if (glTexture.mipmap){
            gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR_MIPMAP_LINEAR : gl.NEAREST_MIPMAP_NEAREST);

            // TODO 各向异性拓展处理

        }else{
            gl.texParameteri(texture.target, gl.TEXTURE_MIN_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
        }

        gl.texParameteri(texture.target, gl.TEXTURE_MAG_FILTER, texture.scaleMode === SCALE_MODES.LINEAR ? gl.LINEAR : gl.NEAREST);
    }

    /**
     * 销毁纹理
     * @param {BaseTexture} texture 基础纹理
     * @param {Boolean} contextLost 是否上下文环境丢失
     * @private
     */
    dispose(texture, contextLost){
        const { gl, CONTEXT_UID} = this;

        // texture = texture?.getBaseTexture();

        // 非上下文环境丢失
        if (!contextLost){
            // 解绑
            this.unbind(texture);
        }

        // 从管理列表中移除
        delete this.managedTextures[texture.id];

        // 移除监听
        texture.disposeRunner.remove(this);

        // 删除WebGLTexture
        const glTexture = texture.glTextures[CONTEXT_UID];
        gl.deleteTexture(glTexture.texture);

        // 删除GLTexture
        delete texture.glTextures[CONTEXT_UID];
    }

    /**
     * 移除所有纹理，包括两个空白纹理
     * @param {Boolean} contextLost 是否上下文环境丢失
     */
    disposeAll(contextLost){
        const { gl } = this;

        // 销毁空白纹理
        for (const k in this.#emptyTextures){
            gl.deleteTexture(this.#emptyTextures[k].texture);
        }

        for (const k in this.managedTextures){
            this.dispose(this.managedTextures[k], contextLost);
        }
    }

    /**
     * 子系统销毁生命周期
     */
    destroy(){
        this.renderer = null;
    }

}

Extension.add(TextureSystem);