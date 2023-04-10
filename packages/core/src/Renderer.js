
import { ExtensionType, Extension } from "../../extensions/src/index.js";
import { SystemManager } from "./system/SystemManager.js";


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
    static test(){
        // TODO 环境支持情况检查
        return true
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

    // TODO
    resize(){

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
        // 销毁运行器，顺序执行
        this.runners.destroy.emit();

        super.destroy();
    }

}

// Extension.handleByMap(ExtensionType.RendererPlugin, Renderer._plugins);
Extension.handleByList(ExtensionType.RendererSystem, Renderer._systems);
Extension.add(Renderer)