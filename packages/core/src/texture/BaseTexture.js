import { settings } from "../../../browser/src/index.js";
import { ALPHA_MODE, FORMATS, SCALE_MODES, TARGETS } from "../../../constants/src/index.js";
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
     * 缩放模式
     * @Number
     * @private
     */
    #scaleMode;

    /**
     * 透明模式
     * @Number
     * @public
     */
    alphaMode;

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

    /**
     * 默认配置
     * @Object
     * @static
     */
    static defaultOptions = {
        scaleMode: SCALE_MODES.LINEAR,

        alphaMode: ALPHA_MODE.UNPACK,

        target: TARGETS.TEXTURE_2D,

        format: FORMATS.RGBA,
    }

    constructor(resource, options = {}){
        options = Object.assign({}, BaseTexture.defaultOptions, options);

        const {
            width, height, resolution, scaleMode, alphaMode, target, format, resourceOptions
        } = options;

        if (resource && !(resource instanceof Resource)){
            resource = autoDetectResource(resource, resourceOptions);
        }

        this.#resolution = resolution || settings.RESOLUTION;
        this.width = Math.round((width || 0) * this.#resolution) / this.#resolution;
        this.height = Math.round((height || 0) * this.#resolution) / this.#resolution;
        this.#scaleMode = scaleMode;

        this.alphaMode = alphaMode;

        this.target = target;

        this.format = format;

        this.isPowOfTwo = false;
        this.#refreshPOT();
        
        this.#id = UID++;
        this.updateID = 0;

        this.valid = width > 0 && height > 0

        this.loadRunner = new Runner('onLoad');
        this.updateRunner = new Runner('onUpdate');
        this.errorRunner = new Runner('onError');
        this.disposeRunner = new Runner('dispose');

        this.setResource(resource);
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

    getBaseTexture(){
        return this;
    }
}