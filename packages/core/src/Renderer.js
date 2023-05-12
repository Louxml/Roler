
import { ExtensionType, Extension } from "../../extensions/src/index.js";
import { SystemManager } from "./system/SystemManager.js";
import { Adapter } from "../../browser/src/index.js";


export class Renderer extends SystemManager{
    static extension = {
        type: ExtensionType.Renderer,
        priority: 1,
    }

    /**
     * TODO 独立到PluginSystem中
     * 插件列表
     * @static
     */
    static _plugins = {};

    /**
     * 系统列表
     * @static
     */
    static _systems = [];

    /**
     * 检查环境是否支持
     * @returns 环境是否支持
     */
    static test(options){
        // TODO 环境支持情况检查
        if (options.render != "webgl"){
            return false
        }

        return Adapter.isWebGLSupported();
    }

    constructor(options){
        super();


        const config ={
            runners: [
                'init', 'destroy', 'contextChange', 'reset', 'update', 'postrender', 'prerender', 'resize'
            ],
            systems: Renderer._systems
        }

        this.setup(config);

        this.startup.run(options)
    }

    // TODO
    render(){

    }

    /**
     * ViewSystem的外部调用方法
     * 修改屏幕尺寸大小
     */
    resize(screenWidth,screenHeight){
        this.view.resizeView(screenWidth, screenHeight);
    }

    // TODO
    reset(){

    }

    // TODO
    clear(){

    }



    /**
     * 销毁渲染器
     * @oublic
     */
    destroy(){
        // 销毁运行器，逆序执行
        this.runners.destroy.reverseEmit();


        super.destroy();
    }

    /**
     * ViewSystem的内部属性
     * 屏幕尺寸大小
     */
    get screen(){
        return this.view.screen;
    }

    /**
     * 获取分辨率宽度
     * @Number
     */
    get width(){
        return this.view.element.width;
    }

    /**
     * 获取分辨率高度
     * @Number
     */
    get height(){
        return this.view.element.height;
    }

    /**
     * 获取Canvas节点
     */
    get canvas(){
        return this.view.element;
    }

    /**
     * 获取上下文环境对象
     */
    get gl(){
        return this.context.gl;
    }

    /**
     * 获取上下文唯一标识
     * @Number
     */
    get CONTEXT_UID(){
        return this.context.CONTEXT_UID;
    }

}

// Extension.handleByMap(ExtensionType.RendererPlugin, Renderer._plugins);
Extension.handleByList(ExtensionType.RendererSystem, Renderer._systems);
Extension.add(Renderer)