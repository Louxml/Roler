

import { Extension, ExtensionType } from "../../extensions/src/index.js";

// Application类型插件一般不实例化，作为一个静态类操作Application，赋予Application属性和功能
export class RendererPlugin{

    static extension = ExtensionType.Application;

    /**
     * 渲染器列表
     * @static
     * @Array
     */
    static _renderers = [];

    /**
     * 初始化插件
     * @static
     * @public
     * @param {Object} options 插件配置
     */
    static init(options){
        this.renderer = RendererPlugin.autoDetectRenderer(options);
    }

    /**
     * 销毁插件
     * @static
     * @public
     */
    static destroy(){
        if (this.renderer){
            const renderer = this.renderer;

            this.renderer = null;

            renderer.destroy();
        }
    }

    /**
     * 自动创建渲染器
     * @static
     * @param {Object} options 选项配置
     * @returns 渲染器实例
     */
    static autoDetectRenderer(options){
        for (const RendererType of this._renderers){
            if (RendererType.test(options)){
                return new RendererType(options);
            }
        }

        throw new Error(`Unable a suitable renderer.`);
    }
}

Extension.handleByList(ExtensionType.Renderer, RendererPlugin._renderers);
Extension.add(RendererPlugin);