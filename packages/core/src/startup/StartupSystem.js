

import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";


export class StartupSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "startup"
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
        console.log("init")
    }

    run(options){
        this.renderer.runners.init.emit(options);
    }

    destroy(){

    }

}

Extension.add(StartupSystem);