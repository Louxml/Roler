
import { Runner } from "../../../runner/src/index.js";

export class SystemManager{


    /**
     * 运行器列表
     * @public
     * 
     */
    runners = [];

    constructor(){

    }
    

    /**
     * 建立渲染器，设置属性
     * @param {Object} options 配置
     */
    setup(options){
        this.addRunners(options.runners);

        const systems = options.systems || {};

        for (const i in systems){
            this.addSystem(systems[i]);
        }
    }
    


    /**
     * 添加运行器
     * @public
     * @param {Array} runners 运行器名称列表
     */
    addRunners(runners){
        runners.forEach(runner => {
            this.runners[runner] = new Runner(runner);
        });
    }


    /**
     * 添加子系统
     * @public
     * @param {System} ClassRef 子系统类
     * @param {String} name 子系统名字
     */
    addSystem(ClassRef){
        const system = new ClassRef();
        const name = system.name;

        if (this[name]){
            throw new Error(`The name "${name}" is already in use.`)
        }

        this[name] = system;

        for (const i in this.runners){
            this.runners[i].add(system);
        }
    }

    /**
     * 自定义参数触发运行器
     * @public
     * @param {Runner} runner 运行器
     * @param {Object} optinos 配置列表，用于各自系统的调用参数
     */
    emitWithCustomOptions(runner, optinos){
        runner.item.forEach(system => {
            system[runner.name](options[system.name]);
        })
    }

    /**
     * 销毁
     * @public
     */
    destroy(){
        this.runners.forEach(runner => {
            runner.destroy();
        });
    }
}