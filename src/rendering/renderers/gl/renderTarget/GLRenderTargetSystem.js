


import { ExtensionType } from "../../../../extensions/index.js";
import { RenderTargetSystem } from "../../shared/renderTarget/RenderTargetSystem.js";
import { GLRenderTargetAdaptor } from "./GLRenderTargetAdaptor.js";


export class GLRenderTargetSystem extends RenderTargetSystem {

    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'renderTarget'
    }

    adaptor = new GLRenderTargetAdaptor();

    constructor(renderer){
        super(renderer);

        
        this.adaptor.init(renderer, this);
    }

    init(){
        console.log('GLRenderTargetSystem init');
    }
}