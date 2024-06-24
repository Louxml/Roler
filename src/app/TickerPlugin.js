
import { ExtensionType } from "../extensions/index.js";
import { Ticker } from "../ticker/index.js";

// 默认配置
const config = {
    autoStart: true,
    sharedTicker: false
}


/**
 * Application类型插件一般不实例化，作为一个静态类操作Application，赋予Application属性和功能
 * @static
 */
export class TickerPlugin{

    static extension = ExtensionType.Application;

    /**
     * 初始化插件
     * @static
     * @public
     * @param {Object} options 插件配置
     */
    static async init(options){
        options = Object.assign({}, config, options);
        this.ticker = options.sharedTicker ? Ticker.shared : new Ticker({
            autoStart: options.autoStart
        });

        this.start = () => {
            this.ticker.start();
        }

        this.stop = () => {
            this.ticker.stop();
        }
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