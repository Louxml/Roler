import { Node } from "../../display/index.js";
import { Renderer } from "../../core/index.js";

/**
 * 便利类创建新的PIXI应用程序。
 * 此类自动创建渲染器、ticker和根容器。
 * @example
 * // 创建应用
 * const app = new Roler.Application();
 *
 * // 将视图添加到节点上
 * document.body.appendChild(app.view);
 *
 * // 添加一个对象
 * app.stage.addChild(Roler.Sprite.from('something.png'));
 *
 * @class
 * @memberof Roler
 */
export class Application{

    static #plugins = [];

    root = new Node();

    renderer;

    // 获取视图HTML节点
    get view(){
        return this.renderer.view;
    }

    // 获取屏幕大小
    get screen(){
        return this.renderer.screen;
    }

    constructor(options = {}){

        // 默认配置
        options = Object.assign({
            forceCanvas: false,
        }, options);

        // 渲染器
        this.renderer = new Renderer(options);

        // 插件初始化
        Application.#plugins.forEach((plugin) => {
            plugin.init.call(this, options);
        });
    }

    // 注册插件
    static registerPlugin(plugin){
        if (Application.#plugins.indexOf(plugin) !== -1)
            Application.#plugins.push(plugin);
        else console.warn("插件已存在");
    }

    // 渲染
    render(){
        this.renderer.render(this.root);
    }

    // 注销 (是否移除HTML节点， 配置)
    destroy(removeView = false, options = {}){
        const plugins = Application.#plugins.slice(0);

        plugins.reverse();
        plugins.forEach((plugin) => {
            plugins.destroy.call(this);
        })

        this.root.destroy(options);
        this.root = null;

        this.renderer.destroy(removeView);
        this.renderer = null;
    }
}