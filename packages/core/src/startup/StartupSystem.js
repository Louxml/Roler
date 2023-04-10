

import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";


export class StartupSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "startup",
        priority: -1
    }

    /**
     * 渲染器对象
     * @public
     */
    renderer;

    constructor(renderer){
        super();

        this.renderer = renderer;
    }

    init(){
        console.log(`Roler-dev ${"v0.0.1"} is Running!`);
    }

    run(options){
        this.renderer.runners.init.emit(options);
    }

    destroy(){

    }

}

Extension.add(StartupSystem);