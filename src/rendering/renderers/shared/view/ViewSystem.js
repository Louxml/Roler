

import { ExtensionType } from "../../../../extensions/index.js";
import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { System } from "../system/System.js";
import { DOMAdapter } from "../../../../environment/Adapter.js";
import { getCanvasTexture } from "../texture/utils/getCanvasTexture.js";
import { RenderTarget } from "../renderTarget/RenderTarget.js";

// ViewSystemOptions
// {
//     width?:
//     height?:
//     canvas?:
//     view?:
//     autoDensity?:
//     resolution?:
//     antialias?:
//     depth?:
//     multiView?:
//     backgroundAlpha?:
// 

export class ViewSystem extends System {

    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem,
        ],
        name: "view",
        priority: 0,
    }

    static defaultOptions = {
        width: 800,
        height: 600,
        /**
         * 根据宽高自动设置css宽高
         */
        autoDensity: false,
        /**
         * 是否启用抗锯齿
         */
        antialias: false,
    }


    /**
     * 渲染视图,CanvasHTML节点
     * @public
     */
    canvas;

    /**
     * 视图位置区域
     * @public
     */
    screen;

    /**
     * 是否启用抗锯齿
     */
    antialias;

    // TODO
    init(options){
        console.log('ViewSystem init');
        options = {...ViewSystem.defaultOptions, ...options};
        
        this.screen = new Rectangle(0, 0, options.width, options.height);
        this.canvas = options.canvas || DOMAdapter.get().createCanvas(options.width, options.height);
        this.antialias = !!options.antialias;

        this.texture = getCanvasTexture(this.canvas, options);
        this.texture.label = 'main';

        this.renderTarget = new RenderTarget({
            colorTextures: [this.texture],
            // 是否开启深度缓冲区
            depth: !!options.depth,
            isRoot: true,
        });
        this.texture.source.transparent = options.backgroundAlpha < 1;

        // TODO 多视图
        this.multiView = !!options.multiView;

        if (options.autoDensity) {
            this.canvas.style.width = `${this.texture.width}px`;
            this.canvas.style.height = `${this.texture.height}px`;
        }

        if (options.target) {
            options.target.appendChild(this.canvas);
        }
    }

    resize(width, height, resolution){
        this.texture.source.resize(width, height, resolution);

        this.screen.width = this.texture.frame.width;
        this.screen.height = this.texture.frame.height;

        if (options.autoDensity) {
            this.canvas.style.width = `${width}px`;
            this.canvas.style.height = `${height}px`;
        }
    }


    /**
     * 销毁方法
     * @param {Object | Boolean} options 配置，或者是否移除视图（canvas）
     * @param {Boolean} options.removeView 是否移除视图（canvas）
     */
    destroy(options){
        const remove = typeof options === "boolean" ? options : options.removeView;

        if (remove) {
            this.canvas?.parentNode?.removeChild(this.canvas);
        }
    }

    get resolution(){
        return this.texture.source.resolution;
    }

    set resolution(value){
        this.texture.source.resize(
            this.texture.source.width,
            this.texture.source.height,
            value
        );
    }

}