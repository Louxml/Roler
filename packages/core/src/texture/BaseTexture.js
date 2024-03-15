import { settings } from "../../../browser/src/index.js";
import { ALPHA_MODE, FORMATS, MIPMAP_MODES, SCALE_MODES, TARGETS, TYPES, WRAP_MODES } from "../../../constants/src/index.js";
import { BaseTextureCache } from "./utils/BaseTexureCache.js";
import { Runner } from "../../../runner/src/index.js";
import { isPow2 } from "../../../utils/src/index.js";
import { Resource } from "./resources/Resource.js";
import { autoDetectResource } from "./resources/autoDetectResource.js";

let UID = 0;


export class BaseTexture{

    /**
     * 基础纹理的宽度
     * @Number
     * @public
     */
    width;

    /**
     * 基础纹理的高度
     * @Number
     */
    height;

    #resolution;

    /**
     * mipmap模式
     * @Nubmer
     */
    #mipmap;

    /**
     * 缩放模式
     * @Number
     * @private
     */
    #scaleMode;

    /**
     * 边缘模式
     * @Number
     * @private
     */
    #wrapMode;

    /**
     * 透明模式
     * @Number
     * @public
     */
    alphaMode;

    /**
     * 各向异性等级
     */
    anisotropicLevel;

    /**
     * target 类型
     * @Number
     * @public
     */
    target;

    /**
     * 数据格式
     * @Number
     */
    format;

    /**
     * 资源的数据类型
     */
    type;

    /**
     * 唯一id
     * @Number
     * @private
     */
    #id;
    
    /**
     * 更新ID
     */
    updateID;

    /**
     * 状态更新ID
     */
    updateStyleID;

    /**
     * 资源
     * @Resource
     * @public
     */
    resource;

    /**
     * 宽高是否都是2的指数幂
     * @Boolean
     */
    isPowOfTwo;

    /**
     * 纹理缓存别名列表
     * @public
     * @member {Array<string>}
     */
    textureCacheIds;

    /**
     * 是否有效，资源是否完整
     */
    valid;

    loadRunner;

    updateRunner;

    errorRunner;

    disposeRunner;

    get id(){
        return this.#id;
    }

    get realWidth(){
        return Math.round(this.width * this.#resolution);
    }

    get realHeight(){
        return Math.round(this.height * this.#resolution);
    }

    get mipmap(){
        return this.#mipmap;
    }

    set mipmap(value){
        if (this.#mipmap !== value){
            this.#mipmap = value;
            this.updateID++;
        }
    }

    get scaleMode(){
        return this.#scaleMode;
    }

    set scaleMode(value){
        if (this.#scaleMode !== value){
            this.#scaleMode = value;
            this.updateID++;
        }
    }

    get wrapMode(){
        return this.#wrapMode;
    }

    set wrapMode(value){
        if (this.#wrapMode !== value){
            this.#wrapMode = value;
            this.updateID++;
        }
    }
    

    /**
     * 默认配置
     * @Object
     * @static
     */
    static defaultOptions = {
        mipmap: MIPMAP_MODES.POW2,
        
        anisotropicLevel: 0,

        scaleMode: SCALE_MODES.LINEAR,

        wrapMode: WRAP_MODES.CLAMP,

        alphaMode: ALPHA_MODE.UNPACK,

        target: TARGETS.TEXTURE_2D,

        format: FORMATS.RGBA,

        type: TYPES.UNSIGNED_BYTE,
    }

    constructor(resource, options = {}){
        options = Object.assign({}, BaseTexture.defaultOptions, options);

        const {
            width, height, resolution, mipmap, scaleMode, wrapMode, alphaMode, target, format, type, resourceOptions
        } = options;

        if (resource && !(resource instanceof Resource)){
            resource = autoDetectResource(resource, resourceOptions);
        }

        this.#resolution = resolution || settings.RESOLUTION;
        this.width = Math.round((width || 0) * this.#resolution) / this.#resolution;
        this.height = Math.round((height || 0) * this.#resolution) / this.#resolution;
        this.#scaleMode = scaleMode;
        this.#wrapMode = wrapMode;
        this.#mipmap = mipmap;
        this.alphaMode = alphaMode;
        this.target = target;
        this.format = format;
        this.type = type;

        this.isPowOfTwo = false;
        this.#refreshPOT();
        
        this.#id = UID++;
        this.updateID = 0;
        this.updateStyleID = 0;

        this.textureCacheIds = [];

        this.valid = width > 0 && height > 0;
        this.resource = null;

        this.loadRunner = new Runner('onLoad');
        this.updateRunner = new Runner('onUpdate');
        this.errorRunner = new Runner('onError');
        this.disposeRunner = new Runner('dispose');

        this.setResource(resource);
    }

    // TODO
    setStyle(){

    }

    // TODO
    setSize(){

    }

    setRealSize(width, height, resolution){
        this.#resolution = resolution || this.#resolution;
        this.width = Math.round(width) / this.#resolution;
        this.height = Math.round(height) / this.#resolution;

        this.#refreshPOT();

        this.update();
    
        return this;
    }

    #refreshPOT(){
        this.isPowOfTwo = isPow2(this.width) && isPow2(this.height);
    }

    // TODO
    setResolution(){

    }

    setResource(resource){
        if (this.resource === resource){
            return this;
        }

        if (this.resource){
            throw new Error(`Resource can be set only once`);
        }

        resource.bind(this);

        this.resource = resource;

        return this;
    }

    update(){
        if (!this.valid){
            if (this.width > 0 && this.height > 0){
                this.valid = true;

                this.loadRunner.emit(this);
                this.updateRunner.emit(this);
            }
        }else{
            this.updateID++;
            this.updateRunner.emit(this);
        }
    }

    onResize(width, height){
        this.setRealSize(width, height);
    }

    
    onUpdate(){
        this.update();
    }

    
    onError(e){
        this.errorRunner.emit(this, e);
    }
    
    dispose(){
        this.disposeRunner.emit(this);
    }

    // TODO
    destroy(){
        
    }
    

    getBaseTexture(){
        return this;
    }


    /**
     * 创建BaseTexture，并添加到缓存中
     * @param {Resource| String} source 源资源
     * @param {Object} options 配置
     * @param {Boolean} strict 是否开启严格模式
     * @returns BaseTexture纹理
     */
    static from(source, options, strict){
        const isFrame = typeof source === 'string';
        let cacheId = null;

        if (isFrame){
            cacheId = source;
        }else{
            if (!source.nameId){
                const prefix = options.prefix || 'rolerid';
                source.nameId = `${prefix}_${UID++}`;
            }
            cacheId = source.nameId;
        }

        let baseTexture = BaseTextureCache[cacheId];

        if (isFrame && strict && !baseTexture){
            throw new Error(`基础纹理缓存中没有 ID[${cacheId}] 的纹理`);
        }

        if (!baseTexture){
            baseTexture = new BaseTexture(source, options);
            BaseTexture.addToCache(baseTexture, cacheId);
        }

        return baseTexture;
    }

    // TODO
    static fromBuffer(buffer, width, height, options){
        buffer = buffer || new Float32Array(width * height * 4);
        
        // const resource = ;
        const type = buffer instanceof Float32Array ? TYPES.FLOAT : TYPES.UNSIGNED_BYTE;

        const defaultBufferOptions = {
            scaleMode: SCALE_MODES.NEAREST,
            format: FORMATS.RGBA,
            alphaMode: ALPHA_MODE.NPM
        }

        return new BaseTexture(resource, Object.assign({}, defaultBufferOptions, {type}, options));
    }

    
    /**
     * 将基础纹理添加到基础纹理缓存中
     * @param {BaseTexture} baseTexture 基础纹理
     * @param {String} id 纹理别名
     */
    static addToCache(baseTexture, id){
        if (id){
            if (!baseTexture.textureCacheIds.includes(id)){
                baseTexture.textureCacheIds.push(id);
            }

            if (BaseTextureCache[id] &&  BaseTextureCache[id] !== baseTexture){
                console.warn(`基础纹理缓存中已存在 id[${id}]`);
            }

            BaseTextureCache[id] = baseTexture;
        }
    }

    /**
     * 将基础纹理从基础纹理缓存中移除
     * @param {BaseTexture | String} baseTexture 基础纹理或者纹理别名
     * @returns 被删除的基础纹理
     */
    static removeToCahce(baseTexture){
        if (typeof baseTexture === 'string'){
            const baseTextureFromCache = BaseTextureCache[baseTexture];
            if (baseTextureFromCache){

                const index = baseTextureFromCache.textureCacheIds.indexOf(baseTexture);

                if (index > -1){
                    baseTextureFromCache.textureCacheIds.splice(index, 1);
                }

                delete BaseTextureCache[baseTexture];

                return baseTextureFromCache;
            }
        }else if(baseTexture?.textureCacheIds){
            for (let i = 0; i < baseTexture.textureCacheIds.length; i++){
                delete BaseTextureCache[baseTexture.textureCacheIds[i]];
            }

            baseTexture.textureCacheIds.length = 0;

            return baseTexture;
        }
    }
}