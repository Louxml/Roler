
import { Extension, ExtensionType } from "../../extensions/src/index.js";
import { Ticker } from "./index.js";

// 默认配置
const config = {
    autoStart: true,
    sharedTicker: false
}


// Application类型插件一般不实例化，作为一个静态类操作Application，赋予Application属性和功能
export class TickerPlugin{

    static extension = ExtensionType.Application;

    /**
     * 初始化插件
     * @static
     * @public
     * @param {Object} options 插件配置
     */
    static init(options){
        options = Object.assign({}, config, options);
        this.ticker = options.sharedTicker ? Ticker.shared : new Ticker({
            autoStart: options.autoStart
        });
    }

    /**
     * 销毁插件
     * @static
     * @public
     */
    static destroy(){
        if (this.ticker){
            const ticker = this.ticker;

            this.ticker = null;

            ticker.destroy();
        }
    }
}

Extension.add(TickerPlugin);