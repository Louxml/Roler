
import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";

import { State } from "./State.js";

export class StateSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "state",
        priority: 70
    }

    /**
     * 渲染器对象
     * @public
     */
    renderer;

    constructor(renderer){
        super();

        this.renderer = renderer;

        this.defaultState = new State();
    }

    init(){
        console.log("State System")
    }

    destroy(){

    }

}

Extension.add(StateSystem);