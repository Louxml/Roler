import { Runner } from "../../../../runner/src/index.js";


/**
 * 资源抽象类，请勿实例化
 */
export class Resource{

    /**
     * 源
     * @String
     * @public
     */
    src;

    /**
     * 宽度
     * @Number
     * @private
     */
    #width;

    /**
     * 高度
     * @Number
     * @private
     */
    #height;

    /**
     * 调整大小调度器
     * @Runner
     * @private
     */
    onResize;

    /**
     * 更新调度器
     * @Runner
     * @private
     */
    onUpdate;

    /**
     * 错误调度器
     * @Runner
     * @private
     */
    onError;

    /**
     * 是否已销毁
     * @Boolean
     * @public
     */
    destroyed;

    get width(){
        return this.#width;
    }

    get height(){
        return this.#height;
    }
    
    get valid(){
        return !!this.#width && !!this.#height;
    }

    constructor(width = 0, height = 0){
        this.#width = width;
        this.#height = height;

        this.destroyed = false;

        this.onResize = new Runner('onResize');
        this.onUpdate = new Runner('onUpdate');
        this.onError = new Runner('onError');
    }

    /**
     * 绑定BaseTexture对象
     * @param {BaseTexture} baseTexture 
     * @public
     */
    bind(baseTexture){
        this.onResize.add(baseTexture);
        this.onUpdate.add(baseTexture);
        this.onError.add(baseTexture);

        if (this.#width || this.#height){
            this.onResize.emit(this.#width, this.#height);
        }
    }

    /**
     * 解绑BaseTexture对象
     * @param {BaseTexture} baseTexture 
     * @public
     */
    unbind(baseTexture){
        this.onResize.remove(baseTexture);
        this.onUpdate.remove(baseTexture);
        this.onError.remove(baseTexture);
    }

    /**
     * 设置资源宽高
     * @param {Number} width 宽度
     * @param {Number} height 高度
     * @public
     */
    resize(width, height){
        if (width !== this.#width || height !== this.#height){
            this.#width = width;
            this.#height = height;
            this.onResize.emit(width, height);
        }
    }

    /**
     * 触发资源更新事件
     * @abstract
     */
    update(){
        if (this.destroyed)return;

        this.onUpdate.emit();
    }

    /**
     * 加载方法，子类重写
     * @abstract
     */
    load(){
        return Promise.resolve(this);
    }

    /**
     * 纹理上传GPU
     * @abstract
     */
    upload(renderer, baseTexture, glTexture){

    }


    /**
     * TODO
     */
    style(){

    }

    /**
     * 销毁处理逻辑，子类重写
     * @abstract
     */
    dispose(){

    }

    /**
     * 销毁资源
     * @public
     */
    destroy(){
        if (this.destroyed) return;
        this.destroyed = true;
        this.dispose();
        this.onResize.removeAll()
        this.onResize = null;
        this.onUpdate.removeAll();
        this.onUpdate = null;
        this.onError.removeAll();
        this.onError = null;
    }


    /**
     * 检查资源类型
     * @param {*} source 资源
     * @param {String} extension 资源拓展名
     * @returns {Boolean}
     */
    static test(source, extension){
        return false;
    }
}

export const ResourcePlugins = [];