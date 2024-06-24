

import { ExtensionType } from "../../../../extensions/index.js";
import { System } from "../system/System.js";

let saidHello = false;

export const VERSION = 'v0.0.0';


export class HelloSystem extends System{
    
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: "hello",
        priority: -10,
    }

    static defaultOptions = {
        hello: true
    }

    init(options){
        options = {...HelloSystem.defaultOptions, ...options}

        if (options.hello) {
            const name = this.renderer.name;
            this.#sayHello(name);
        }

    }

    #sayHello(type){
        if (saidHello) return;
        saidHello = true;

        const func = new Function("version", "type", "globalThis.console.log(`RolerJS ${version} - ${type}`);");
        func(VERSION, type);
    }

    destroy(){

    }
}