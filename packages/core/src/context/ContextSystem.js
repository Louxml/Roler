

import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";


let CONTEXT_UID_COUNTER = 0;

export class ContextSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "context",
        priority: 80
    }

    /**
     * 默认配置
     */
    static defaultOptions = {
        // 是否开启抗锯齿
        antialias: false,
        // 电源配置（default：默认，high-performance：高性能，low-power：节能模式）
        powerPreference: "default",
        // 绘制缓冲区包含预混合alpha值  TODO：？
        premultipliedAlpha: true,
        // 保留上次缓冲区
        preserveDrawingBuffer: false
    }

    /**
     * webGL版本，1 或者 2， 对应 WebGL1 和 WebGL2
     * @public
     */
    webGLVersion;

    /**
     * 渲染器对象
     * @public
     */
    renderer;

    /**
     * 上下文环境
     * @private
     */
    #gl;

    /**
     * 上下文UID
     * @private
     */
    #CONTEXT_UID;

    /**
     * WebGL拓展列表
     * @public
     */
    extensions = {};

    /**
     * 电源配置
     * （default：默认，high-performance：高性能，low-power：节能模式）
     * @public
     */
    powerPreference;

    /**
     * 保留上次缓冲区
     * @public
     */
    preserveDrawingBuffer;

    constructor(renderer){
        super();

        this.renderer = renderer;

        this.onContextLost = this.onContextLost.bind(this);
        this.onContextRestored = this.onContextRestored.bind(this);
    }

    init(options){
        options = this.optionsAssign(ContextSystem.defaultOptions, options)

        const alpha = this.renderer.background.alpha < 1;

        this.powerPreference = options.powerPreference
        this.preserveDrawingBuffer = options.preserveDrawingBuffer

        this.initFromOptions({
            alpha,
            stencil: true,
            antialias: options.antialias,
            powerPreference: options.powerPreference,
            premultipliedAlpha: options.premultipliedAlpha,
            preserveDrawingBuffer: options.preserveDrawingBuffer
        });
    }

    contextChange(gl){
        this.#gl = gl;
        this.#CONTEXT_UID = ++CONTEXT_UID_COUNTER;
        console.log("change")
    }

    /**
     * 通过配置初始化上下文环境
     * @param {Object} options 配置
     * @public
     */
    initFromOptions(options){
        const gl = this.createContext(this.renderer.canvas, options);
        this.initFromContext(gl);
    }

    /**
     * 根据传入的上下文环境初始化
     * @param {WebGLRenderingContext} gl 上下文环境
     * @public
     */
    initFromContext(gl){
        this.validateContext(gl);

        this.renderer.runners.contextChange.emit(gl);

        this.getExtensions();

        const canvas = this.renderer.canvas;
        
        canvas.addEventListener?.('webglcontextlost', this.onContextLost, false);
        canvas.addEventListener?.('webglcontextrestored', this.onContextRestored, false);
    }

    /**
     * 创建上下文环境
     * @param {HTMLCanvasElement} canvas 画布节点
     * @param {Object} options 配置
     * @returns 返回上下文对象
     */
    createContext(canvas, options){
        let gl;
        // webgl2
        gl = canvas.getContext('webgl2', options);

        // webgl1
        if (!gl){
            gl = canvas.getContext('webgl', options) || canvas.getContext('experimental-webgl', options)
        }

        if (!gl){
            throw new Error("This browser does not support WebGL. Try using the canvas renderer");
        }

        return gl;
    }

    /**
     * 获取WebGL拓展
     * @private
     */
    getExtensions(){
        const { gl } = this;
        const common = {
            loseContext: gl.getExtension("WEBGL_lose_context"),
            anisotropicFiltering: gl.getExtension("EXT_texture_filter_anisotropic"),
            floatTextureLinear: gl.getExtension("OES_texture_float_linear"),

            astc: gl.getExtension("WEBGL_compressed_texture_astc"),
            atc: gl.getExtension("WEBGL_compressed_texture_atc"),
            etc: gl.getExtension("WEBGL_compressed_texture_etc"),
            etc1: gl.getExtension("WEBGL_compressed_texture_etc1"),
            pvrtc: gl.getExtension("WEBGL_compressed_texture_pvrtc") || gl.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc"),
            s3tc: gl.getExtension("WEBGL_compressed_texture_s3tc"),
            s3tc_sRGB: gl.getExtension("WEBGL_compressed_texture_s3tc_srgb"),

        }

        if (this.webGLVersion === 1){
            Object.assign(this.extensions, common, {
                instanceArray: gl.getExtension("ANGLE_instanced_arrays"),
                blendMinMax: gl.getExtension("EXT_blend_minmax"),
                fragDepth: gl.getExtension("EXT_frag_depth"),
                sRGB: gl.getExtension("EXT_sRGB"),
                shaderTextureLod: gl.getExtension("EXT_shader_texture_lod"),
                unit32ElementIndex: gl.getExtension("OES_element_index_uint"),
                fboRenderMipmap: gl.getExtension("OES_fbo_render_mipmap"),
                standardDerivatives: gl.getExtension("OES_standard_derivatives"),
                // float or half float
                floatTexture: gl.getExtension("OES_texture_float"),
                textureHalfFloat: gl.getExtension("OES_texture_half_float"),
                textureHalfFloatLinear: gl.getExtension("OES_texture_half_float_linear"),
    
                vertexArrayObject: gl.getExtension("OES_vertex_array_object"),
                colorBufferFloat: gl.getExtension("WEBGL_color_buffer_float"),
                depthTexture: gl.getExtension("WEBGL_depth_texture"),
                drawBuffers: gl.getExtension("WEBGL_draw_buffers"),
            });
        }else if (this.webGLVersion === 2){
            Object.assign(this.extensions, common, {
                colorBufferFloat: gl.getExtension("EXT_color_buffer_float"),
            })
        }
    }

    /**
     * 检测传入的上下文环境
     * @param {WebGLRenderingContext} gl 上下文对象
     * @private
     */
    validateContext(gl){
        if ('WebGL2RenderingContext' in globalThis && gl instanceof globalThis.WebGL2RenderingContext){
            this.webGLVersion = 2;
        }else if ('WebGLRenderingContext' in globalThis && gl instanceof globalThis.WebGLRenderingContext){
            this.webGLVersion = 1;
        }

        if (!gl.getContextAttributes()?.stencil)
        {
            console.warn('Provided WebGL context does not have a stencil buffer, masks may not render correctly');
        }
    }

    /**
     * 上下文环境丢失事件
     * @param {Event} e 事件对象
     */
    onContextLost(e){
        e.preventDefault();
        console.log("contextlost")
        setTimeout(() => {
            if (this.gl.isContextLost()){
                this.extensions.loseContext?.restoreContext();
            }
        }, 0);
    }

    /**
     * 上下文环境还原事件
     */
    onContextRestored(){
        console.log("contextrestored")
        this.renderer.runners.contextChange.emit(this.gl);
    }

    // TODO postRender需要处理吗

    destroy(){
        const canvas = this.renderer.canvas;
        canvas.removeEventListener?.('webglcontextlost', this.onContextLost);
        canvas.removeEventListener?.('webglcontextrestored', this.onContextRestored);

        this.extensions.loseContext?.loseContext();
    }

    get isLost(){
        return !this.gl || this.gl.isContextLost();
    }

    get gl(){
        return this.#gl;
    }

    get CONTEXT_UID(){
        return this.#CONTEXT_UID;
    }

}

Extension.add(ContextSystem);