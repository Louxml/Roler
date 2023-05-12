
import { Extension, ExtensionType } from "../../../extensions/src/index.js";

export class System{
    static extension = {}

    get name(){
        return this.constructor.extension.name || this.constructor.name
    }

    constructor(){

    }

    /**
     * 混合配置
     * @param {Object} defaultOptions 默认配置
     * @param {Object} options 选项配置
     * @returns 混合配置
     */
    optionsAssign(defaultOptions, options){
        const config = {};
        Object.keys(defaultOptions).map((key) => {
            config[key] = options[key] || defaultOptions[key];
        });

        return config
    }

    init(){
        
    }

    destroy(){
        
    }
}