import { Color } from "../../../../color/Color.js";
import { ExtensionType } from "../../../../extensions/index.js";
import { System } from "../system/System.js";


export class BackgroundSystem extends System {

    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: "background",
        priority: 0,
    };

    static defaultOptions = {
        /**
         * 背景透明度
         * @Number
         * @default 1
         */
        backgroundAlpha: 1,

        /**
         * 背景颜色
         * @Number
         * @default 0x000000
         */
        backgroundColor: 0x000000,

        /**
         * 是否在渲染前清除背景
         * @Boolean
         * @default true
         */
        clearBeforeRender: true,
    };


    clearBeforeRender;

    #backgroundColor;
    
    constructor(renderer) {
        super(renderer);

        this.clearBeforeRender = true
        this.#backgroundColor = new Color(0x000000);
        this.alpha = 1;
    }

    init(options){
        console.log('BackgroundSystem init');
        options = {...BackgroundSystem.defaultOptions, ...options};
        this.clearBeforeRender = options.clearBeforeRender;
        this.color = options.background || options.backgroundColor || this.#backgroundColor;
        this.alpha = options.backgroundAlpha;
    }

    destroy(){
        
    }

    get color(){
        return this.#backgroundColor;
    }

    set color(value){
        this.#backgroundColor.setValue(value);
    }

    get alpha(){
        return this.#backgroundColor.alpha;
    }

    set alpha(value){
        this.#backgroundColor.setAlpha(value);
    }

}