
import { Extension, ExtensionType } from "../../../extensions/src/index.js";

export class System{
    static extension = {}

    get name(){
        return this.constructor.extension.name || this.constructor.name
    }

    constructor(){

    }

    init(){
        
    }

    destroy(){
        
    }
}