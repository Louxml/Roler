

import { Extension, ExtensionType } from "../../../../extensions/index.js";
import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { System } from "../system/System.js";
import { DOMAdapter } from "../../../../environment/Adapter.js";

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
        options = {...ViewSystem.defaultOptions, ...options};
        
        this.screen = new Rectangle(0, 0, options.width, options.height);
        this.canvas = options.canvas || DOMAdapter.get().createCanvas(options.width, options.height);
        this.antialias = !!options.antialias;

        // TODO TextSystem
        // this.texture = ;

        // TODO RenderTargetSystem
        // this.renderTarget = ;

        // TODO
        // this.multiView = !!options.multiView;

        if (options.autoDensity) {
            // TOOD 要替换成texture的宽高
            this.canvas.style.width = `${options.width}px`;
            this.canvas.style.height = `${options.height}px`;
        }

        if (options.target) {
            options.target.appendChild(this.canvas);
        }
    }

    // TODO
    resize(width, height, resolution){

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

    // TODO TextureSystem
    // get resolution(){
        
    // }

    // TODO TextureSystem
    // set resolution(value){
        
    // }

}