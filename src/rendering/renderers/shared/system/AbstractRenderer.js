import { loadEnvironmentExtensions } from "../../../../environment/autoDetectEnvironment.js";
import { Runner } from "../../../../runner/index.js";


const defaultRunners = [
    'init',
    'destroy',
    'contextChange',
    // 'resolutionChange',
    'reset',
    // 'renderEnd',
    // 'renderStart',
    'render',
    'update',
    // 'postrender',
    // 'prerender',
]

/**
 * AbstractRenderer
 * 渲染器基类
 * @param {Object} config 渲染器配置
 * @param {Number} config.type 渲染器类型
 * @param {String} config.name 渲染器名称
 * @param {String[]}  config.runners 渲染器运行器
 * @param {{name:String, value:Object}[]}  config.systems 渲染器系统
 * @param {{name:String, value:Object}[]}  config.renderPipes 渲染器渲染管道
 * @param {{name:String, value:Any}[]}  config.renderPipeAdaptors 渲染器渲染管道适配器
 */
export class AbstractRenderer {

    #type;

    #name;

    #config;

    runners = Object.create(null);
    
    constructor(config){
        this.#type = config.type;
        this.#name = config.name;
        this.#config = config;

        const combinedRunners = [...defaultRunners, ...(config.runners ?? [])];


        this._addRunners(...combinedRunners);

        this._checkUnsafeEval();
    }

    async init(options){
        const skip = options.skipExtensionImports;

        await loadEnvironmentExtensions(skip);
    }

    /**
     * 添加运行器
     * @private
     * @param  {...any} runners 运行器
     */
    _addRunners(...runners){
        runners.forEach(runnerId => {
            this.runners[runnerId] = new Runner(runnerId);
        })
    }

    /**
     * 检测是否指出 unsafe-eval，不支持则报错异常
     * @todo 需要实现
     */
    _checkUnsafeEval(){

    }
    

    get type(){
        return this.#type;
    }

    get name(){
        return this.#name;
    }
}