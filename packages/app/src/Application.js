
import { Ticker } from '../../ticker/src/index.js';
import { Scene, SceneManager } from '../../scene/src/index.js';

import { config } from './config.js'

export class Application{

    // 场景管理器
    scenes;

    // 主循环
    runner;

    // HTMLElement
    target;

    // 渲染器
    renderer;

    constructor(options){
        // 配置覆盖
        options = Object.assign({}, config, options);

        this.target = config.target;

        this.ticker = new Ticker();
        
        // 场景管理器
        this.scenes = new SceneManager(this);
        

        // 渲染器创建
        // let canvas = document.createElement("canvas");
        // canvas.width = options.width
        // canvas.height = options.height
        // this.renderer = canvas.getContext(options.render);
        // this.target.append(this.renderer.canvas)
    }

}