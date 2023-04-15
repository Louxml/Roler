

import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";

import { Color } from "../../../color/src/index.js";


export class BackgroundSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "background",
        priority: 90
    }

    /**
     * 默认配置
     */
    static defaultOptions = {
        // 颜色
        backgroundColor: 0x0,
        // 透明度
        backgroundAlpha: 1,
        // 清除上次渲染
        clearBeforeRender: true
    }

    backgroundColor;

    backgroundAlpha;

    clearBeforeRender;
    

    constructor(){
        super();

        this.backgroundColor = new Color(0, 0, 0);

        this.backgroundAlpha = 1;

        this.clearBeforeRender = true;
    }

    init(){
        
    }


    destroy(){

    }

}

Extension.add(BackgroundSystem);