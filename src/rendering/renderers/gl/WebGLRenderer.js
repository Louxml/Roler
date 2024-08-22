import { Extension, ExtensionType } from "../../../extensions/index.js";
import { AbstractRenderer } from "../shared/system/AbstractRenderer.js";

import { RendererType } from "../types.js";

import { SharedSystems, SharedRenderPipes } from "../shared/system/SharedSystems.js";
import { GLContextSystem } from "./context/GLContextSystem.js";
import { GLStateSystem } from "./state/GLStateSystem.js";
import { GLBufferSystem } from "./buffer/GLBufferSystem.js";
import { GLGeometrySystem } from "./geometry/GLGeometrySystem.js";
import { GLShaderSystem } from "./shader/GLShaderSystem.js";
import { GLUniformGroupSystem } from "./shader/GLUniformGroupSystem.js";
import { GLRenderTargetSystem } from "./renderTarget/GLRenderTargetSystem.js";
import { GLTextureSystem } from "./texture/GLTextureSystem.js";
import { GLEncoderSystem } from "./encoder/GLEncoderSystem.js";
import { GLStencilSystem } from "./stencil/GLStencilSystem.js";
import { GLColorMaskSystem } from "./colormask/GLColorMaskSystem.js";
import { GLBackBufferSystem } from "./backbuffer/GLBackBufferSystem.js";
import { GLUboSystem } from "./ubo/GLUboSystem.js";


const DefaultWebGLSystems = [
    ...SharedSystems, // 默认系统
    GLUboSystem, // webgl ubo(Uniform Buffer Object)系统
    GLBackBufferSystem, // webgl后缓冲区系统
    GLContextSystem, // webgl上下文系统
    GLBufferSystem, // webgl缓冲区系统
    GLTextureSystem, // webgl纹理系统
    GLRenderTargetSystem, // webgl渲染目标系统
    GLGeometrySystem, // webgl几何系统
    GLUniformGroupSystem, // webgl uniform组系统
    GLShaderSystem, // webgl着色器系统
    GLEncoderSystem, // webgl编码器系统
    GLStateSystem, // webgl状态系统
    GLStencilSystem, // webgl模板系统
    GLColorMaskSystem, // webgl颜色掩码系统
];

const DefaultWebGLPipes = [...SharedRenderPipes];

const DefaultWebGLAdapters = [];


const systems = [];
const renderPipes = [];
const renderPipeAdaptors = [];

Extension.handleByNamedList(ExtensionType.WebGLSystem, systems);
Extension.handleByNamedList(ExtensionType.WebGLPipes, renderPipes);
Extension.handleByNamedList(ExtensionType.WebGLPipesAdaptor, renderPipeAdaptors);

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

    get gl(){
        return this.context.gl;
    }
}

Extension.add(WebGLRenderer);
