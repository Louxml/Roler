
import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";


export class GeometrySystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "geometry",
        priority: 40
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
        console.log(`Geometry System`);
    }

    destroy(){

    }

}

Extension.add(GeometrySystem);