
import { Extension, ExtensionType } from "../../../extensions/src/index.js";


/**
 * 视图系统
 */
export class ViewSystem{

    /**
     * 拓展属性
     * @ignore
     */
    static extension = {
        type: ExtensionType.RendererSystem,
        name: "_view",
    }

    /**
     * 渲染器
     * @private
     */ 
    #renderer;

    /**
     * 分辨率/屏幕像素比
     * @public
     */
    resolution;


    // screen;

    /**
     * Canvas节点
     * @public
     */
    element;

    get renderer(){
        return this.renderer;
    }

    constructor(renderer){
        this.#renderer  = renderer;
    }

    /**
     * 初始化
     * @public
     * @param {Object} options 配置
     */
    init(options){
        this.resolution = options.resolution || 1;//默认值取设置
        this.element = options.view;    //默认创建
    }

    /**
     * 重置设备屏幕宽高
     * @public
     * @param {Number} width 屏幕像素宽度
     * @param {Number} height 屏幕像素高度
     */
    resizeView(width, height){
        this.element.width = Math.round(width * this.resolution);
        this.element.height = Math.round(height * this.resolution);


        // 通知渲染器视图大小改变

    }

    /**
     * 生命周期
     * 系统销毁
     * @public
     * @param {Boolean} removeView 是否移除canvas节点
     */
    destroy(removeView){
        if (removeView && this.element && this.element.parentNode){
            this.element.parentNode.removeChild(this.element);
        }

        this.renderer = null;
        this.element = null;
    }
}

// Extension.add(ViewSystem);