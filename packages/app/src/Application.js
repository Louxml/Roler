
import { Runner } from '../../runner/src/index.js';
import { SceneManager } from '../../scene/src/index.js';

import { config } from './config.js'

export class Application{

    // 场景
    SceneManager;

    // 主循环
    Runner;

    // HTMLElement
    target;

    // 渲染器
    renderer;

    constructor(options){
        // 配置覆盖
        Object.assign(config, options);

        this.Runner = new Runner();
        this.SceneManager = new SceneManager();
        this.target = config.target;

        // 渲染器创建
        // let canvas = document.createElement("canvas");
        // canvas.width = options.width
        // canvas.height = options.height
        // this.renderer = canvas.getContext(options.render);
        // this.target.append(this.renderer.canvas)
    }

}