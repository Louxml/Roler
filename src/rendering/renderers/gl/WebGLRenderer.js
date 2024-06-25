import { Extension, ExtensionType } from "../../../extensions/index.js";
import { AbstractRenderer } from "../shared/system/AbstractRenderer.js";

import { RendererType } from "../types.js";

import { SharedSystems, SharedRenderPipes } from "../shared/system/SharedSystems.js";
import { GLContextSystem } from "./context/GLContextSystem.js";


const DefaultWebGLSystems = [
    ...SharedSystems, // 默认系统
    GLContextSystem, // webgl上下文系统
];

const DefaultWebGLPipes = [...SharedRenderPipes];

const DefaultWebGLAdapters = [];


const systems = [];
const renderPipes = [];
const renderPipeAdaptors = [];

Extension.handleByNamedList(ExtensionType.WebGLSystem, systems);
Extension.handleByNamedList(ExtensionType.WebGLPipes, renderPipes);
Extension.handleByNamedList(ExtensionType.WebGLPipeAdaptor, renderPipeAdaptors);

Extension.add(...DefaultWebGLSystems, ...DefaultWebGLPipes, ...DefaultWebGLAdapters);


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
