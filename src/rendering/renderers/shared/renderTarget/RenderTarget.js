import { uid } from "../../../../utils/data/uid.js";
import { Texture } from "../texture/Texture.js";
import { TextureSource } from "../texture/sources/TextureSource.js";


export class RenderTarget {

    static defaultOptions = {
        /** 宽度 */
        width: 0,
        /**高度 */
        height: 0,
        /** 分辨率系数 */
        resolution: 1,
        /** 颜色纹理数量 */
        colorTextures: 1,
        /** 是否使用模板缓冲区 */
        stencil: false,
        /** 是否使用深度缓冲区 */
        depth: false,
        /** 使用使用抗锯齿 */
        antialias: false,
        /** 是否为根渲染目标，所有渲染的目标 */
        isRoot: false
    }

    #uid = uid('renderTarget');

    /** 颜色纹理 */
    colorTextures = [];

    /**
     * 深度模板纹
     * @type {TextureSource}
     */
    depthStencilTexture;

    /** 是否使用模板缓冲区 */
    stencil;

    /** 是否使用深度缓冲区 */
    depth;

    isRoot = false;

    #updateID = 0;

    #size = new Float32Array(2);

    /** 是否有创建的纹理 */
    #managedColorTextures = false;

    constructor(options){
        options = { ...RenderTarget.defaultOptions, ...options };

        this.stencil = options.stencil;
        this.depth = options.depth;
        this.isRoot = options.isRoot;

        // 创建指定数量的空纹理源
        if (typeof options.colorTextures === 'number'){
            this.#managedColorTextures = true;

            for (let i = 0; i < options.colorTextures; i++){
                this.colorTextures.push(new TextureSource({
                    width: options.width,
                    height: options.height,
                    resolution: options.resolution,
                    antialias: options.antialias
                }));
            }
        }else {
            // 使用传入的纹理源
            this.colorTextures = options.colorTextures.map(texture => texture.source);
            
            this.resize(this.colorTexture.width, this.colorTexture.height, this.colorTexture.resolution);
        }

        this.colorTexture.on('reisze', this.#onSourceResize, this);

        // TODO 监听纹理销毁

        if (options.depthStencilTexture || this.stencil){
            if (options.depthStencilTexture instanceof Texture || options.depthStencilTexture instanceof TextureSource){
                this.depthStencilTexture = options.depthStencilTexture.source;
            }else{
                this.ensureDepthStencilTexture();
            }
        }
    }

    /**
     * 重置所有纹理大小
     * @param {Number} width 宽度
     * @param {Number} height 高度
     * @param {Number} resolution 分辨率
     * @param {Boolean} skipColorTexture 跳过当前colorTexture
     */
    resize(width, height, resolution, skipColorTexture){
        this.#updateID++;

        // 统一纹理大小？
        this.colorTextures.forEach((source, i) => {
            if (skipColorTexture && i == 0) return;

            source.resize(width, height, resolution);
        });

        this.depthStencilTexture?.resize(width, height, resolution);

    }


    /**
     * 纹理大小改变时
     * @param {TextureSource} source 纹理源
     */
    #onSourceResize(source){
        this.resize(source.widht, source.height, source.resolution, true);
    }

    /**
     * 确保深度模板纹理存在
     */
    ensureDepthStencilTexture(){
        this.depthStencilTexture ??= new TextureSource({
            width: this.width,
            height: this.height,
            resolution: this.resolution,
            format: 'depth24plus-stencil8',
            antialias: false,
        });
    }



    destroy(){
        // 当前纹理
        this.colorTexture.off('reisze', this.#onSourceResize, this);

        // 销毁创建的颜色纹理
        if (this.#managedColorTextures){
            this.colorTextures.forEach(texture => texture.destroy());
        }

        // 销毁深度模板纹理
        this.depthStencilTexture?.destroy();
    }

    get uid(){
        return this.#uid;
    }

    get updateID(){
        return this.#updateID;
    }

    /** 获取颜色纹理 */
    get colorTexture(){
        return this.colorTextures[0];
    }

    get size(){
        const size = this.#size;

        size[0] = this.pixelWidth;
        size[1] = this.pixelHeight

        return [...size];
    }

    get width(){
        return this.colorTexture.width;
    }

    get height(){
        return this.colorTexture.height;
    }

    get pixelWidth(){
        return this.colorTexture.pixelWidth;
    }

    get pixelHeight(){
        return this.colorTexture.pixelHeight;
    }

    get resolution(){
        return this.colorTexture.resolution;
    }
}