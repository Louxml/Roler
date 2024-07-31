


import { isPow2 } from "../../../../../maths/utils/pow2.js";
import { uid } from "../../../../../utils/data/uid.js";
import { BindResource } from "../../../gpu/shader/BindResource.js";
import { TextureStyle } from "../TextureStyle.js";


export class TextureSource extends BindResource {

    //#region 事件
    /** @event update */
    /** @event change */
    /** @event resize */
    /** @event unload */
    /** @event destroy */
    /** @event styleChange */
    /** @event updateMipmaps */
    //#endregion

    
    static defaultOptions = {
        label: '',
        resolution: 1,
        format: 'rgba8unorm',
        /** 透明模式，默认：预乘alpha */
        alphaMode: 'premultiply-alpha-on-upload',
        /** 纹理维度 */
        dimensions: '2d',
        /** mipmap等级 */
        mipLevelCount: 1,
        /** 自动生成mipmap */
        autoGenerateMipmaps: false,
        /** 采样次数 */
        sampleCount: 1,
        /** 抗锯齿 */
        antialias: false,
        /** 自动垃圾回收 */
        autoGarbageCollect: false
    }

    //#region 属性
    /**
     * 唯一标识
     */
    #uid;

    /**
     * 标签
     */
    label;

    /**
     * 
     */
    #resolution = 1;

    /**
     * 源纹理的像素宽度
     * @Number
     */
    pixelWidth = 1;

    /**
     * 源纹理的像素高度
     * @Number
     */
    pixelHeight = 1;

    /** 纹理宽度 */
    width = 1;

    /** 纹理高度 */
    height = 1;

    /**
     * 上传至GPU的资源，例如ImageBit / Canvas / Video
     */
    resource;

    /** 纹理采样数 */
    sampleCount;

    /** mipmap等级 */
    mipLevelCount;

    /** 自动生成mipmap，设置为true将会覆盖mipmapLevelCount属性 */
    autoGenerateMipmaps;

    /** 纹理数据格式 */
    format;

    /** 纹理维度 */
    dimensions;

    /** 透明模式 */
    alphaMode;

    /** 抗锯齿，只影响RenderTexture */
    antialias;

    /** 是否销毁 */
    destroyed = false;

    /** 纹理宽高是否为2的指数幂 */
    isPowerOfTwo = false;

    /** 是否自动垃圾回收 */
    autoGarbageCollect;

    #style;

    /** 纹理上传方法类型，具体实现在GLTextureSystem里 */
    uploadMethodId = 'unknown';


    //#endregion

    constructor(options){
        super('textureSource');
        this.#uid = uid('textureSource');
        // 配置
        options = {... TextureSource.defaultOptions, ...options};

        this.label = options.label;
        this.resource = options.resource;
        this.autoGarbageCollect = options.autoGarbageCollect;
        this.#resolution = options.resolution;

        this.pixelWidth = options.width ? options.width * this.#resolution : this.resourceWidth;
        this.pixelHeight = options.height ? options.height * this.#resolution : this.resourceHeight;

        this.width = this.pixelWidth / this.#resolution;
        this.height = this.pixelHeight / this.#resolution;

        this.format = options.format;
        this.dimensions = options.dimensions;
        this.mipLevelCount = options.mipLevelCount;
        this.autoGenerateMipmaps = options.autoGenerateMipmaps;
        this.sampleCount = options.sampleCount;
        this.antialias = options.antialias;
        this.alphaMode = options.alphaMode;

        this.style = new TextureStyle(options);

        this.#refreshPOT();
    }

    /**
     * 更新纹理时，需调用此方法
     */
    update(){
        if (this.resource){
            const resolution = this.#resolution;

            const isResize = this.resize(this.resourceWidth / resolution, this.resourceHeight / resolution);

            // TODO 为什么退出更新
            if (isResize) return;
        }

        this.emit('update', this);
    }

    resize(width = this.width, height = this.height, resolution = this.resolution){
        const newPixelWidth = Math.round(width * resolution);
        const newPixelHeight = Math.round(height * resolution);

        this.width = newPixelWidth / resolution;
        this.height = newPixelHeight / resolution;

        this.#resolution = resolution;

        if (this.pixelWidth === newPixelWidth && this.pixelHeight === newPixelHeight) return false;
        
        this.#refreshPOT();
        this.pixelWidth = newPixelWidth;
        this.pixelHeight = newPixelHeight;

        this.emit('resize', this);
        // TODO 为什么要更新resourceId
        this.emit('change', this);

        return true;

    }

    /** GPU释放资源 */
    unload(){
        // TODO 更新resourceId
        this.emit('change', this);
        this.emit('unload', this);
    }


    /** 更新mipmap */
    updateMipmaps(){
        if (this.autoGenerateMipmaps && this.mipLevelCount > 1){
            this.emit('updateMipmaps', this);
        }
    }


    #refreshPOT(){
        this.isPowerOfTwo = isPow2(this.pixelWidth) && isPow2(this.pixelHeight);
    }

    #onStyleChange(){
        this.emit('styleChange', this);
    }

    destroy(){
        this.destroyed = true;

        this.emit('destroy', this);
        // TODO 为什么触发 change事件
        this.emit('change', this);

        this.#style?.destroy();
        this.#style = null;

        this.uploadMethodId = null;
        this.resource = null;
        this.clear();
    }


    get uid(){
        return this.#uid;
    }

    get resolution(){
        return this.#resolution;
    }

    set resolution(value){
        if (this.#resolution === value) return;
        
        this.#resolution = value;

        this.width = this.pixelWidth / this.#resolution;
        this.height = this.pixelHeight / this.#resolution;
    }

    get source(){
        return this;
    }

    get style(){
        return this.#style;
    }

    set style(value){
        if (this.#style === value) return;
        
        this.#style?.off('change', this.#onStyleChange, this);
        this.#style = value;
        this.#style?.on('change', this.#onStyleChange, this);

        this.#onStyleChange();
    }

    get repeatMode(){
        return this.#style.wrapMode;
    }

    set repeatMode(value){
        this.#style.wrapMode = value;
    }

    get wrapMode(){
        return this.#style.wrapMode;
    }

    set wrapMode(value){
        this.#style.wrapMode = value;
    }

    get scaleMode(){
        return this.#style.scaleMode;
    }

    set scaleMode(value){
        this.#style.scaleMode = value;
    }

    get mapFilter(){
        return this.#style.magFilter;
    }

    set mapFilter(value){
        this.#style.magFilter = value;
    }

    get minFilter(){
        return this.#style.minFilter;
    }

    set minFilter(value){
        this.#style.minFilter = value;
    }

    get mipmapFilter(){
        return this.#style.mipmapFilter;
    }

    set mipmapFilter(value){
        this.#style.mipmapFilter = value;
    }

    get lodMinClamp(){
        return this.#style.lodMinClamp;
    }

    set lodMinClamp(value){
        this.#style.lodMinClamp = value;
    }

    get lodMaxClamp(){
        return this.#style.lodMaxClamp;
    }

    set lodMaxClamp(value){
        this.#style.lodMaxClamp = value;
    }


    /** 源资源宽度 */
    get resourceWidth(){
        const { resource } = this;
        return  resource?.naturalWidth ?? resource?.vidoWidth ?? resource?.displayWidth ?? resource?.width ?? 1;
    }

    /** 源资源高度 */
    get resourceHeight(){
        const { resource } = this;
        return  resource?.naturalHeight || resource?.videoHeight || resource?.displayHeight || resource?.height || 1;
    }

    static from = (resource) => new TextureSource(resource);
}