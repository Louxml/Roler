
import { Extension, ExtensionType } from '../extensions/index.js';
import { config } from './config.js'

export class Application{
    
    /**
     * 插件列表
     * 所有功能组件系统
     */
    static _plugins = [];

    constructor(){
        
    }

    async init(options){
        // 配置覆盖
        options = Object.assign({}, config, options);

        // 异步初始化
        const plugins = Application._plugins.slice(0);

        // 异步初始化插件
        plugins.forEach(async (plugin) => {
            await plugin.init.call(this, options);
        })
    }

    /**
     * 销毁
     * @public
     */
    destroy(){
        const plugins = Application._plugins.slice(0);

        // 反序
        plugins.reverse();

        // 反序销毁插件
        plugins.forEach((plugin) => {
            plugin.destroy.call(this);
        })
    }

}

Extension.handleByList(ExtensionType.Application, Application._plugins);