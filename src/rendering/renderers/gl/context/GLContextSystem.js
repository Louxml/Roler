
import { DOMAdapter } from "../../../../environment/Adapter.js";
import { ExtensionType } from "../../../../extensions/index.js";
import { System } from "../../shared/system/System.js";
import { uid } from "../../../../utils/data/uid.js";

import { webgl1Extensions, webgl2Extensions } from "./WebGLExtensions.js";


export const ContextSystemOptions = {
    /**
     * The WebGL context
     */
    context: WebGL2RenderingContext,
    /**
     * 电源偏好，高性能或者低功耗
     */
    powerPreference: 'high-performance' | 'low-power',
    /**
     * 是否开启预乘alpha
     */
    premultipliedAlpha: true,

    /**
     * 是否启用图形缓冲区保存
     */
    preserveDrawingBuffer: false,

    /**
     * 是否开启抗锯齿
     */
    antialias: false,

    /**
     * 首选webgl版本
     */
    preferWebGLVersion: 2,
}



export class GLContextSystem extends System{

    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'context',
    }

    /**
     * 默认配置
     */
    static defaultOptions = {
        context: null,
        premultipliedAlpha: true,
        preserveDrawingBuffer: false,
        powerPreference: 'default',
        preferWebGLVersion: 2,
    }

    /**
     * webgl拓展列表
     * @public
     */
    extensions;

    /**
     * 当前上下文唯一标识
     * @protected
     */
    #CONTEXT_UID;

    #gl;

    /**
     * 是否强制丢失上下文
     * @protected
     */
    #contextLossForced;

    /**
     * 当前webgl版本
     * @protected
     */
    webGLVersion;

    /**
     * 支持的拓展功能
     */
    supports = {
        /**
         * 是否支持32位索引缓冲区
         */
        uint32Indices: true,

        /**
         * 是否支持UBO (UniformBufferObject)
         */
        uniformBufferObject: true,

        /**
         * 是否支持VAO (VertexArrayObject)
         */
        vertexArrayObject: true,

        /**
         * 是否支持SRGB纹理格式
         */
        srgbTextures: true,

        /**
         * 是否支持纹理非POT（2的次幂）的wrapping
         */
        nonPowOf2wrapping: true,

        /**
         * 是否支持MSAA (动态纹理抗锯齿)
         */
        msaa: true,

        /**
         * 是否支持纹理非POT（2的次幂）的mipmaps
         */
        nonPowOf2mipmaps: true,
    }

    constructor(renderer){
        super(renderer);

        this.extensions = Object.create(null);

        this.onContextLost = this.onContextLost.bind(this);
        this.onContextRestored = this.onContextRestored.bind(this);
    }

    init(options){
        console.log("GLContextSystem init");
        options = {...GLContextSystem.defaultOptions, ...options};

        if (options.context){
            this.initFromContext(options.context);
        }else{
            const alpha = this.renderer.background.alpha < 1;
            const premultipliedAlpha = options.premultipliedAlpha;
            const antialias = options.antialias && !this.renderer.backBuffer.useBackBuffer;
            const preserveDrawingBuffer = options.preserveDrawingBuffer;
            const powerPreference = options.powerPreference;

            this.createContext(options.preferWebGLVersion, {
                alpha,
                premultipliedAlpha,
                antialias,
                stencil: true,
                preserveDrawingBuffer,
                powerPreference,
            });
        }

    }

    contextChange(gl){
        this.#CONTEXT_UID = uid('context');
    }

    initFromContext(gl){
        this.#gl = gl;

        this.webGLVersion = gl instanceof DOMAdapter.get().getWebGLRendereringContext() ? 1 : 2;

        this.getExtensions();

        this.validateContext(gl);

        this.renderer.runners.contextChange.emit(gl);

        const canvas = this.renderer.view.canvas;
        canvas.addEventListener('webglcontextlost', this.onContextLost, false);
        canvas.addEventListener('webglcontextrestored', this.onContextRestored, false);
    }

    /**
     * 创建webgl上下文
     * @param {Number} version webgl
     * @param {Options} options 可选配置
     */
    createContext(version, options){
        let gl;
        const canvas = this.renderer.view.canvas;

        if (version === 2){
            gl = canvas.getContext('webgl2', options);
        }

        if (!gl){
            gl = canvas.getContext('webgl', options);
        }

        if (!gl){
            throw new Error('This browser does not support WebGL.');
        }

        this.initFromContext(gl);
    }


    /**
     * 获取并添加webgl拓展
     */
    getExtensions(){
        const gl = this.#gl;

        // 当前环境支持的拓展
        const extensions = gl.getSupportedExtensions();

        let list = {};
        if (this.webGLVersion === 1){
            list = {...webgl1Extensions}
        }else{
            list = {...webgl2Extensions}
        }

        for (let name in list){
            const value = list[name];
            if (typeof value === 'string'){
                if (extensions.includes(value)){
                    this.extensions[name] = gl.getExtension(value);
                }
            }else if(value instanceof Array){
                for (const v of value){
                    if (typeof v === 'string' && extensions.includes(v)){
                        this.extensions[name] = gl.getExtension(v);
                        break;
                    }
                }
            }
        }
    }

    onContextLost(event){
        event.preventDefault();

        console.log('context lost');

        if (this.#contextLossForced){
            this.#contextLossForced = false;
            
            setTimeout(() => {
                if (this.#gl.isContextLost()){
                    this.extensions.loseContext?.restoreContext();
                }
            }, 0);
        }
        
    }

    onContextRestored(){
        console.log('context restored');
        this.renderer.runners.contextChange.emit(this.#gl);
    }

    /**
     * 销毁方法
     */
    destroy(){
        const canvas = this.renderer.view.canvas;
        canvas.removeEventListener('webglcontextlost', this.onContextLost, false);
        canvas.removeEventListener('webglcontextrestored', this.onContextRestored, false);

        this.renderer = null;

        this.extensions.loseContext?.loseContext();
    }

    /**
     * 强制webgl上下文丢失
     */
    forceContextLoss(){
        this.extensions.loseContext?.loseContext();
        this.#contextLossForced = true;
    }

    /**
     * 检查webgl上下文环境及拓展
     * @param {WebGLRenderingContext} gl webgl渲染上下文
     */
    validateContext(gl){
        const attributes = gl.getContextAttributes();
        
        if (!attributes?.stencil){
            console.warn('WebGL context does not support stencil buffer, some features may not work as expected.');
        }

        const supports = this.supports;
        const isWebGL2 = this.webGLVersion === 2;
        const extensions = this.extensions;

        supports.uint32Indices = isWebGL2 || !!extensions.uint32ElementIndex;
        supports.uniformBufferObject = isWebGL2;
        supports.vertexArrayObject = isWebGL2 || !!extensions.vertexArrayObject;
        supports.srgbTextures = isWebGL2 || !!extensions.sRGB;
        supports.nonPowOf2wrapping = isWebGL2;
        supports.nonPowOf2mipmaps = isWebGL2;
        supports.msaa = isWebGL2;

        if (!supports.uint32Indices){
            console.warn('WebGL context does not support 32-bit indices, some features may not work as expected.');
        }
    }

    get isLost(){
        return !this.#gl || this.#gl.isContextLost();
    }

    get CONTEXT_UID(){
        return this.#CONTEXT_UID;
    }

    get gl(){
        return this.#gl;
    }
}