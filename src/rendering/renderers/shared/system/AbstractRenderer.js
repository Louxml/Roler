import { loadEnvironmentExtensions } from "../../../../environment/autoDetectEnvironment.js";
import { Runner } from "../../../../runner/index.js";


const defaultRunners = [
    'init',
    'destroy',
    'contextChange',
    // 'resolutionChange',
    'reset',
    'renderEnd',
    'renderStart',
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

    static defaultOptions = {
        
        // 渲染器分辨率/设备像素比
        resolution: 1,

        // 像素是否四舍五入
        roundPixels: false,
    }

    #type;

    #name;

    #config;

    #roundPixels;

    // options存储
    #initOptions;

    /**
     * 运行器列表
     */
    runners = Object.create(null);

    /**
     *渲染管线列表
     */
    renderPipes = Object.create(null);

    // 子系统存储哈希表
    #systemHash = Object.create(null);
    
    constructor(config){
        this.#type = config.type;
        this.#name = config.name;
        this.#config = config;

        const combinedRunners = [...defaultRunners, ...(config.runners ?? [])];


        this._addRunners(combinedRunners);

        this._checkUnsafeEval();
    }

    async init(options){
        const skip = options.skipExtensionImports;

        await loadEnvironmentExtensions(skip);

        this._addSystems(this.#config.systems);

        this._addPipes(this.#config.renderPipes, this.#config.renderPipeAdaptors);

        for (const name in this.#systemHash){
            const system = this.#systemHash[name];

            const defaultSystemOptions = system.constructor.defaultOptions ?? {};

            options = {...defaultSystemOptions, ...options};
        }

        options = {...AbstractRenderer.defaultOptions, ...options};

        this.#roundPixels = options.roundPixels ? 1 : 0;

        for (let i = 0; i < this.runners.init.items.length; i++){
            await this.runners.init.items[i].init(options);
        }
        
        this.#initOptions = options;
    }

    // TODO
    render(){

    }

    // TODO
    resize(width, height, resolution){

    }

    /**
     * TODO
     * 清除渲染器
     * @param {Object} options clear配置
     */
    clear(options){

    }

    /**
     * 添加运行器
     * @private
     * @param  {...any} runners 运行器
     */
    _addRunners(runners){
        runners.forEach(runnerId => {
            this.runners[runnerId] = new Runner(runnerId);
        })
    }

    /**
     * 添加子系统列表
     * @param {Array} systems 子系统列表
     */
    _addSystems(systems){
        systems.forEach(system => {
            this._addSystem(system.value, system.name);
        })
    }

    /**
     * 添加子系统
     * @param {Object} ClassRef 子系统类
     * @param {String} name 子系统命名
     */
    _addSystem(ClassRef, name){
        if (this[name]){
            throw new Error(`The name "${name}" is already in use.`)
        }

        const system = new ClassRef(this);

        this[name] = system;

        //TODO system添加hash映射
        this.#systemHash[name] = system;

        for (const i in this.runners){
            this.runners[i].add(system);
        }
    }

    /**
     * 添加渲染管线
     * @param {Object} pipes 渲染管线列表
     * @param {Object} pipeAdaptors 渲染管线适配器列表
     */
    _addPipes(pipes, pipeAdaptors){
        const adaptors = {};
        pipeAdaptors.forEach(adaptor => {
            adaptors[adaptor.name] = adaptor.value;
        })

        pipes.forEach(pipe => {
            const pipeClass = pipe.value;
            const name = pipe.name;

            const Adaptor = adaptors[name];

            this.renderPipes[name] = new pipeClass(this, Adaptor ? new Adaptor() : null);
        })
    }

    /**
     * 渲染器销毁
     * @param {Object} options 销毁配置
     */
    destroy(options){
        this.runners.destroy.items.reverse();
        this.runners.destroy.emit(options);
        
        Object.values(this.runners).forEach(runner => {
            runner.destroy();
        })

        this.runners = null;

        this.#systemHash = null;

        this.renderPipes = null;
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

    get roundPixels(){
        return !!this.#roundPixels;
    }

    // TODO viewSytem
    get resolution(){

    }

    // TODO viewSytem
    set resolution(value){
        
    }

    // TODO viewSytem
    get width(){
        
    }

    // TODO viewSytem
    get height(){
        
    }

    /**
     * 获取Canvas HTML节点
     * @return {HTMLCanvasElement}
     */
    get canvas(){
        return this.view.canvas;
    }
    
    // TODO lastObjectRendered 最后一个渲染的对象，可能对其他子系统、拓展、插件有用

    //TODO 是否渲染到屏幕上

    /**
     * 获取屏幕对象可视区域位置
     * @return {Rectangle}
     */
    get screen(){
        return this.view.screen;
    }

    // TODO GenerateTextureSystem
    generateTexture(options){

    }
}