import { Extension, ExtensionType } from "../../../extensions/index.js";
import { AbstractRenderer } from "../shared/system/AbstractRenderer.js";

import { RendererType } from "../types.js";



const systems = [];
const renderPipes = [];
const renderPipeAdaptors = [];

Extension.handleByNamedList(ExtensionType.WebGLSystem, systems);
Extension.handleByNamedList(ExtensionType.WebGLPipes, renderPipes);
Extension.handleByNamedList(ExtensionType.WebGLPipeAdaptor, renderPipeAdaptors);

export class WebGLRenderer extends AbstractRenderer {

    static extension = ExtensionType.Renderer;
    
    constructor(){
        const config = {
            name: 'webgl',
            type: RendererType.WEBGL,
            systems,
            renderPipes,
            renderPipeAdaptors,
        };

        super(config);
    }

    static test(){
        return true;
    }
}

Extension.add(WebGLRenderer);
