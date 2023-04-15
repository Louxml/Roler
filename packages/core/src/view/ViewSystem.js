
import { System } from "../index.js";
import { Adapter } from "../../../browser/src/index.js";
import { Size } from "../../../math/src/index.js";
import { Extension, ExtensionType } from "../../../extensions/src/index.js";


/**
 * 视图系统
 */
export class ViewSystem extends System{

    /**
     * 拓展属性
     * @ignore
     */
    static extension = {
        type: ExtensionType.RendererSystem,
        name: "view",
        priority: 100
    }
    
    /**
     * 默认配置
     * @ignore
     */
    static defaultOptions = {
        width: 800,
        height: 600,
        resolution: 1,
        autoDensity: false
    }

    /**
     * 渲染器
     * @public
     */ 
    renderer;

    /**
     * 屏幕大小
     * @Size
     * @public
     */
    screen;

    /**
     * 分辨率/屏幕像素比
     * @public
     */
    resolution;

    /**
     * Canvas节点
     * @public
     */
    element;

    /**
     * 根据宽高自动设置css宽高
     * @public
     */
    autoDensity;

    constructor(renderer){
        super();
        this.renderer  = renderer;
    }

    /**
     * 初始化
     * @public
     * @param {Object} options 配置
     */
    init(options){
        options = Object.assign({}, ViewSystem.defaultOptions, options);

        this.screen = new Size(options.width, options.height);

        this.resolution = options.resolution;

        this.element = options.element || Adapter.createCanvas(this.screen.width, this.screen.height);

        this.autoDensity = !!options.autoDensity

        document.body.appendChild(this.element)
    }

    /**
     * 重置设备屏幕宽高
     * @public
     * @param {Number} width 屏幕像素宽度
     * @param {Number} height 屏幕像素高度
     */
    resizeView(width, height){
        // canvas分辨率（实际缓冲区大小）
        this.element.width = Math.round(width * this.resolution);
        this.element.height = Math.round(height * this.resolution);

        // 通知渲染器视图大小改变
        const screenWidth = this.element.width / this.resolution;
        const screenHeight = this.element.height / this.resolution;

        this.screen.set(screenWidth, screenHeight);

        if (this.autoDensity){
            this.element.style.width = `${screenWidth}px`;
            this.element.style.height = `${screenHeight}px`;
        }

        // 通知视图大小调整
        this.renderer.runners.resize.emit(this.screen.width, this.screen.height);
    }

    /**
     * 生命周期
     * 系统销毁
     * @public
     * @param {Boolean} removeView 是否移除canvas节点
     */
    destroy(removeView){
        if (removeView){
            this.element.parentNode?.removeChild(this.element);
        }

        this.renderer = null;
        this.element = null;
        this.screen = null;
    }
}

Extension.add(ViewSystem);