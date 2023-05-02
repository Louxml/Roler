

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

    _color;

    clearBeforeRender;
    

    constructor(){
        super();

        this._color = new Color(0x0);

        this.clearBeforeRender = true;
    }

    init(options){
        const defaults = BackgroundSystem.defaultOptions;
        const config = {};
        Object.keys(defaults).map((key) => {
            config[key] = options[key] || defaults[key]
        });

        this.color = config.backgroundColor;
        this.alpha = config.backgroundAlpha;
        this.clearBeforeRender = config.clearBeforeRender;
    }

    get color(){
        return this._color.value;
    }

    set color(value){
        this._color.value = value;
    }

    get alpha(){
        return this._color.alpha;
    }

    set alpha(value){
        this._color.setAlpha(value);
    }


    get backgroundColor(){
        return this._color;
    }

    destroy(){

    }

}

Extension.add(BackgroundSystem);