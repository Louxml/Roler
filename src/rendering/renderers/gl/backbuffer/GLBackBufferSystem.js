

import { ExtensionType } from "../../../../extensions/index.js";
import { Geometry } from "../../shared/geometry/Geometry.js";
import { Shader } from "../../shared/shader/Shader.js";
import { State } from "../../shared/state/State.js";
import { System } from "../../shared/system/System.js";
import { Texture } from "../../shared/texture/Texture.js";
import { TextureSource } from "../../shared/texture/sources/TextureSource.js";
import { GLProgram } from "../shader/GLProgram.js";
import { CLEAR } from "../texture/const.js";


const bigTriangleGeometry = new Geometry({
    attributes: {
        aPosition: [
            -1, -1,
            3, -1,
            -1, 3
        ]
    }
});


export class GLBackBufferSystem extends System{
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'backBuffer'
    }

    static defaultOptions = {
        useBackBuffer: false
    }

    /**
     * 是否开启后缓冲区
     */
    useBackBuffer;

    /**
     * 是否开启抗锯齿
     */
    #antialias;

    /**
     * 初始状态
     */
    #state;

    /**
     * 大三角形着色器
     */
    #bigTriangleShader;

    // 当前渲染是否使用后缓冲区;每次渲染会重置
    #useBackBufferThisRender;

    /**
     * 后缓冲区纹理源
     */
    #targetTexture;

    /**
     * 后缓冲区纹理
     */
    #backBufferTexture;




    /**
     * 初始化生命周期函数
     * @param {Object} options 配置
     */
    init(options){
        const { useBackBuffer, antialias } = { ...GLBackBufferSystem.defaultOptions, ...options };

        this.useBackBuffer = useBackBuffer;
        this.#antialias = antialias;

        // 检查环境是否支持msaa
        if (!this.renderer.context.supports.msaa){
            console.warn(`GLBackBufferSystem: MSAA not supported`);
            this.#antialias = false;
        }

        this.#state = State.for2d();

        const bigTriangleProgram = new GLProgram({
            vertex: `
                in vec2 aPosition;
                out vec2 vUv;

                void main(){
                    gl_Position = vec4(aPosition, 0.0, 1.0);

                    // [-1, 1] -> [0, 1]
                    vUv = (aPosition + 1.0) / 2.0;
                    
                    // flip y
                    vUv.y = 1.0 - vUv.y; 
                }
            `,
            fragment: `
                in vec3 vUv;
                out vec4 finalColor;

                uniform sampler2D uTexture;

                void main(){
                    finalColor = texture(uTexture, vUv);
                }
            `,
            name: 'big-triangle'
        });

        this.#bigTriangleShader = new Shader({
            glProgram: bigTriangleProgram,
            resources: {
                uTexure: Texture.WHITE.source
            }
        });

    }

    contextChange(){
        console.log('GLBackBufferSystem init')
    }

    /**
     * 渲染开始生命周期函数
     * @param {Object} options 配置
     * @param {Object} options.container 容器
     * @param {Mat3} options.transform 变换矩阵
     * @param {Object} options.target 渲染目标
     */
    renderStart(options){
        console.log('render start')
        const renderTarget = this.renderer.renderTarget.getRenderTarget(options.target);

        this.#useBackBufferThisRender = this.useBackBuffer && !!renderTarget.isRoot;

        if (this.#useBackBufferThisRender){
            this.#targetTexture = renderTarget.colorTexture;

            // 开启后缓冲区后，修改渲染目标，创建一个新的渲染纹理
            options.target = this.#getBackBufferTarget(renderTarget.colorTexture);
        }

    }

    renderEnd(){
        console.log('render end')
        this.#presentBackBuffer();
    }

    #presentBackBuffer(){
        const renderer = this.renderer;

        renderer.renderTarget.finishRenderTarget();

        if (!this.#useBackBufferThisRender) return;

        renderer.renderTarget.bind(this.#targetTexture, CLEAR.NONE);

        this.#bigTriangleShader.resources.uTexure = this.#backBufferTexture.source;

        renderer.encoder.draw({
            geometry: bigTriangleGeometry,
            shader: this.#bigTriangleShader,
            state: this.#state
        });
    }

    /**
     * 获取后缓冲区渲染
     * @param {TextureSource} texture 渲染目标纹理源
     */
    #getBackBufferTarget(texture){
        this.#backBufferTexture ??= new Texture({
            source: new TextureSource({
                width: texture.width,
                height: texture.height,
                resolution: texture.resolution,
                antialias: this.#antialias
            })
        });

        this.#backBufferTexture.source.resize(texture.width, texture.height, texture.resolution);

        return this.#backBufferTexture;
    }

    destroy(){
        this.#backBufferTexture?.destroy();
        this.#backBufferTexture = null;
    }
}