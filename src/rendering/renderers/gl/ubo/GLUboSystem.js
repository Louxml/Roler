

import { ExtensionType } from "../../../../extensions/index.js";
import { UboSystem } from "../../shared/ubo/UboSystem.js";
import { createUboElementsSTD40 } from "./createUboElementsSTD40.js";
import { createUboSyncFunctionSTD40 } from "./createUboSyncSTD40.js";


export class GLUboSystem extends UboSystem{

    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'ubo'
    }

    constructor(renderer){
        super(renderer, {
            createUboElements: createUboElementsSTD40,
            generateUboSync: createUboSyncFunctionSTD40,
        })
    }

    contextChange(){
        console.log('GLUboSystem init');
    }
}