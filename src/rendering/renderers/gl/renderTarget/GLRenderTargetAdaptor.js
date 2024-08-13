

import { Color } from "../../../../color/Color.js";
import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { RenderTarget } from "../../shared/renderTarget/RenderTarget.js";
import { RenderTargetAdaptor } from "../../shared/renderTarget/RenderTargetSystem.js";
import { CLEAR } from "../texture/const.js";
import { GLRenderTarget } from "./GLRenderTarget.js";


export class GLRenderTargetAdaptor extends RenderTargetAdaptor {
    

    #renderTargetSystem;

    #renderer;

    #clearColorCache = new Color();

    #viewportCache = new Rectangle();

    /**
     * 适配器初始化，在GLRenderTargetSystem初始化时调用
     * @param {RendererPlugin} renderer 
     * @param {RenderTargetSystem} renderTargetSystem 
     */
    init(renderer, renderTargetSystem){
        this.#renderer = renderer;
        this.#renderTargetSystem = renderTargetSystem;

        renderer.runners.contextChange.add(this);
    }

    /**
     * contextchange事件处理函数，同System拓展一样，适配器拓展也可以处理contextchange事件
     */
    contextChange(){
        this.#clearColorCache = new Color();
        this.#viewportCache = new Rectangle();
    }

    /**
     * 将渲染目标对象渲染结果复制到纹理对象中
     * @param {RenderTarget} renderTarget 渲染目标对象
     * @param {Texture} texture 复制到的目标纹理
     * @param {x:Number,y:Number} originSrc 源渲染目标的起始坐标
     * @param {width:Number,height:Number} size 源渲染目标的尺寸
     * @param {x:Number,y:Number} originDest 目标纹理的起始坐标
     * @return {Texture} 复制到的目标纹理
     */
    copyToTexture(renderTarget, texture, originSrc, size, originDest){
        const renderTargetSystem = this.#renderTargetSystem;
        const renderer = this.#renderer;
        const gl = renderer.gl;

        const glRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);

        // 完成渲染过程
        this.finishRenderPass(renderTarget);

        renderer.texture.bind(texture, 0);

        gl.copyTexSubImage2D(
            gl.TEXTURE_2D, 0,
            originDest.x, originDest.y,
            originSrc.x, originSrc.y,
            size.width, size.height
        );

        return texture;
    }

    /**
     * 开始渲染过程，设置视口，清除缓冲区；RenderTargetSystem调用
     * @param {RenderTarget} renderTarget 
     * @param {Number} clear 清除缓冲区（颜色、模板或深度）
     * @param {Color} clearColor 清除颜色
     * @param {Rectangle} viewport 视口
     */
    startRenderPass(renderTarget, clear, clearColor, viewport){
        const renderTargetSystem = this.#renderTargetSystem;
        const gl = this.#renderer.gl;

        const source = texture.colorTexture;
        const glRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);


        let viewPortX = viewport.x;
        let viewPortY = viewport.y;
        // TODO 这里为什么要这么处理？
        // if (renderTarget.isRoot){
        //     viewPortY = source.height - viewport.height;
        // }

        // 解绑渲染纹理
        renderTarget.colorTextures.forEach((texture) => {
            this.#renderer.texture.unbind(texture);
        });

        gl.bindFramebuffer(gl.FRAMEBUFFER, glRenderTarget.framebuffer);

        // 设置视口
        const viewPortCache = this.#viewportCache;
        if (viewPortCache.x !== viewPortCache || viewPortCache.y !== viewPortY || viewPortCache.width !== viewport.width || viewPortCache.height != viewport.height){
            viewPortCache.set(viewPortX, viewPortY, viewport.width, viewport.height);
            gl.viewport(viewPortX, viewPortY, viewport.width, viewport.height);
        }

        // 如果需要处理深度模板缓冲区
        if (!glRenderTarget.depthStencilRenderBuffer && (renderTarget.stencil || renderTarget.depth)){
            this.#initStencil(glRenderTarget);
        }

        // 清除缓冲区
        this.clear(renderTarget, clear, clearColor);
    }

    /**
     * 完成一个渲染过程，RenderTargetSystem调用，将处理过msaa的framebuffer复制到resolveTargetFramebuffer中
     * @param {RenderTarget} renderTarget 渲染目标对象
     */
    finishRenderPass(renderTarget){
        const renderTargetSystem = this.#renderTargetSystem;
        const glRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);
        const gl = this.#renderer.gl;
        
        // 没有msaa则不处理
        if (!glRenderTarget.msaa) return;

        // 绑定需要写入的缓冲区
        gl.bindFramebuffer(gl.FRAMEBUFFER. glRenderTarget.resolveTargetFramebuffer);
        // 绑定需要读取的缓冲区
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, glRenderTarget.framebuffer);

        // 复制缓冲区，复制颜色缓冲区，使用最近邻插值
        gl.blitFramebuffer(
            0, 0, glRenderTarget.width, glRenderTarget.height,
            0, 0, glRenderTarget.width, glRenderTarget.height,
            gl.COLOR_BUFFER_BIT, gl.NEAREST
        );

        // 取消绑定到读取缓冲区的frambuffer，并重新绑定缓冲区的frambuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, glRenderTarget.framebuffer);

        // 清除读取缓冲区的frambuffer，这里需要置空吗？
        // gl.bindFramebuffer(gl.READ_FRAMEBUFFER, null);
    }

    /**
     * 清除当前缓冲区
     * @param {RenderTarget} renderTarget 
     * @param {Number} clear 指定缓冲区（CLEAR.COLOR | CLEAR.DEPTH | CLEAR.STENCIL）
     * @param {Color} clearColor 清除颜色
     * @returns 
     */
    clear(renderTarget, clear, clearColor){
        if (!clear) return;

        const renderTargetSystem = this.#renderTargetSystem;
        const gl = this.#renderer.gl;

        // 清除颜色缓冲区
        if (clear & CLEAR.COLOR){
            clearColor ??= renderTargetSystem.defaultClearColor;

            const colorClearCache = this.#clearColorCache;

            if (colorClearCache.r !== clearColor.r || colorClearCache.g !== clearColor.g || colorClearCache.b !== clearColor.b|| colorClearCache.a !== clearColor.a){
                // 更新颜色
                colorClearCache.setRGBA(clearColor.r, clearColor.g, clearColor.b, clearColor.a);
                gl.clearColor(clearColor.red, clearColor.green, clearColor.blue, clearColor.alpha);
            }
        }

        gl.clear(clear);
    }

    /**
     * 创建GLRenderTarget，RenderTargetSystem调用
     * @param {RenderTarget} renderTarget 
     * @returns {GLRenderTarget}
     */
    createGpuRenderTarget(renderTarget){
        const renderer = this.#renderer;
        const gl = renderer.gl;

        const glRenderTarget = new GLRenderTarget();

        // 如果这个渲染目标是主画布
        if (renderTarget.colorTexture.resource === gl.canvas){
            glRenderTarget.framebuffer = null;
            return glRenderTarget;
        }

        // 设置glRenderTarget
        this.#initColor(renderTarget, glRenderTarget)

        // 取消绑定的WebGLFramebuffer
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        return glRenderTarget
    }


    /**
     * 销毁GLRenderTarget，RenderTargetSystem调用，TextureSource销毁时会调用
     * @param {GLRenderTarget} glRenderTarget 
     */
    destroyGpuRenderTarget(glRenderTarget){
        const gl = this.#renderer.gl;

        // 删除framebuffer
        if (glRenderTarget.framebuffer){
            gl.deleteFramebuffer(glRenderTarget.framebuffer);
            glRenderTarget.framebuffer = null;
        }

        // 删除resolveTargetFramebuffer
        if (glRenderTarget.resolveTargetFramebuffer){
            gl.deleteFramebuffer(glRenderTarget.resolveTargetFramebuffer);
            glRenderTarget.resolveTargetFramebuffer = null;
        }

        // 删除深度模板缓冲区
        if (glRenderTarget.depthStencilRenderBuffer){
            gl.deleteFramebuffer(glRenderTarget.depthStencilRenderBuffer);
            glRenderTarget.depthStencilRenderBuffer = null;
        }

        // 删除msaa的渲染缓冲区
        glRenderTarget.msaaRenderBuffer?.forEach(renderBuffer => {
            gl.deleteRenderbuffer(renderBuffer);
        })
        glRenderTarget.msaaRenderBuffer = null;
    }

    /**
     * 重置大小，颜色缓冲区、深度模板缓冲区（如果有）
     * @param {RenderTarget} renderTarget 
     * @returns 
     */
    resizeGpuRenderTarget(renderTarget){
        // 如果是主画布、屏幕上的则不进行resize
        if (renderTarget.isRoot) return;

        const renderTargetSystem = this.#renderTargetSystem;
        const glRenderTarget = renderTargetSystem.getGpuRenderTarget(renderTarget);

        this.#resizeColor(renderTarget, glRenderTarget);

        if (renderTarget.stencil | renderTarget.depth){
            this.#resizeStencil(glRenderTarget);
        }
    }

    /**
     * 初始化GLRenderTarget
     * @param {RenderTarget} renderTarget RenderTarget对象
     * @param {GLRenderTarget} glRenderTarget GLRenderTarget对象
     */
    #initColor(renderTarget, glRenderTarget){
        const renderer = this.#renderer;
        const gl = renderer.gl;

        // 创建WebGLFramebuffer
        const resolveTargetFramebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, resolveTargetFramebuffer);

        glRenderTarget.resolveTargetFramebuffer = resolveTargetFramebuffer;
        glRenderTarget.width = renderTarget.pixelWidth;
        glRenderTarget.height = renderTarget.pixelHeight;

        // 环境是否支持msaa(多重采样抗锯齿)
        const isSupportMSAA = renderer.context.supports.msaa;
        

        // 绑定每一个纹理，关联到WebGLFramebuffer
        renderTarget.colorTextures.forEach((source, i) => {
            // 纹理是否开启抗锯齿
            if (source.antialias){
                if (isSupportMSAA){
                    glRenderTarget.msaa = true;
                }else{
                    console.warn("当前WebGL环境不支持MSAA");
                }
            }

            // 绑定TextureSource，为什么不用bind，不需要bind里的独立采样器吗？
            renderer.texture.bindSource(source, i);

            const glSource = renderer.texture.getGLSource(source);

            // webgl1绑定多纹理需要拓展
            gl.framebufferTexture2D(
                gl.FRAMEBUFFER,
                gl.COLOR_ATTACHMENT0 + i,
                glSource.target,
                glSource.texture,
                0,
            );
        });

        // msaa抗锯齿处理
        if (glRenderTarget.msaa){
            const viewFramebuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, viewFramebuffer);

            glRenderTarget.framebuffer = viewFramebuffer;

            // 为每个纹理创建RenderBuffer
            renderTarget.colorTextures.forEach((_, i) => {
                const msaaRenderBuffer = gl.createRenderBuffer();

                glRenderTarget.msaaRenderBuffer[i] = msaaRenderBuffer;
            })
        }else{
            glRenderTarget.framebuffer = resolveTargetFramebuffer;
        }

        this.#resizeColor(renderTarget, glRenderTarget);
    }

    /**
     * 重置颜色纹理的大小，处理msaa抗锯齿
     * @param {RenderTarget} renderTarget 
     * @param {GLRenderTarget} glRenderTarget 
     * @private
     */
    #resizeColor(renderTarget, glRenderTarget){
        const firstSource = renderTarget.colorTexture;

        glRenderTarget.width = renderTarget.pixelWidth;
        glRenderTarget.height = renderTarget.pixelHeight;

        // 其他纹理的大小和第一个纹理保持一致
        renderTarget.colorTextures.forEach((source, i) => {
            // 第一个纹理不需要处理
            if (i === 0) return;

            source.resize(firstSource.width, firstSource.height, firstSource.resolution);
        });

        // 处理msaa抗锯齿
        if (glRenderTarget.msaa){
            const renderer = this.#renderer;
            const gl = renderer.gl;
            
            const viewFramebuffer = glRenderTarget.framebuffer;

            gl.bindFramebuffer(gl.FRAMEBUFFER, viewFramebuffer);

            renderTarget.colorTextures.forEach((source, i) => {

                // TODO 这里需要绑定吗，还是只是为了获取internalFormat？
                renderer.texture.bindSource(source, 0);
                const glSource = renderer.texture.getGLSource(source);
                const glInternalFormat = glSource.internalFormat;
                const msaaRenderBuffer = glRenderTarget.msaaRenderBuffer[i];

                // 绑定WebGLRenderbuffer
                gl.bindRenderbuffer(
                    gl.RENDERBUFFER,
                    msaaRenderBuffer
                );

                gl.renderbufferStorageMultisample(
                    gl.RENDERBUFFER,
                    4, // msaa采样数
                    glInternalFormat,
                    source.pixelWidth,
                    source.pixelHeight
                );

                // 将webGLRenderbuffer绑定到framebuffer
                gl.framebufferRenderbuffer(
                    gl.FRAMEBUFFER,
                    gl.COLOR_ATTACHMENT0 + i,
                    gl.RENDERBUFFER,
                    msaaRenderBuffer
                );

            });

        }
        
    }

    /**
     * 初始化RenderTarget的深度模板纹理
     * @param {RenderTarget} renderTarget 
     */
    #initStencil(glRenderTarget){
        // 在屏幕上已经存在
        if (glRenderTarget.framebuffer === null) return;

        const gl = this.#renderer.gl;

        const depthStencilRenderbuffer = gl.createRenderBuffer();
        glRenderTarget.depthStencilRenderbuffer = depthStencilRenderbuffer;

        // 绑定当前的RenderBuffer（用作深度模板缓冲区）
        gl.bindRenderbuffer(gl.RENDERBUFFER, depthStencilRenderbuffer);

        // 将深度模板缓冲区附加到当前帧缓冲区中
        gl.framebufferRenderbuffer(
            gl.FRAMEBUFFER,
            gl.DEPTH_STENCIL_ATTACHMENT,
            gl.RENDERBUFFER,
            depthStencilRenderbuffer
        );

        this.#resizeStencil(glRenderTarget);
    }

    /**
     * 重置深度模板缓冲区的大小，处理msaa抗锯齿
     * @param {GLRenderTarget} glRenderTarget 
     */
    #resizeStencil(glRenderTarget){

        const gl = this.#renderer.gl;

        gl.bindRenderbuffer(gl.RENDERBUFFER, glRenderTarget.depthStencilRenderbuffer);

        if (glRenderTarget.msaa){
            gl.renderbufferStorageMultisample(
                gl.RENDERBUFFER,
                4, // msaa采样数
                gl.DEPTH24_STENCIL8,// 深度模板缓冲区格式
                glRenderTarget.width,
                glRenderTarget.height
            );
        }else{
            const format = this.#renderer.context.webGLVersion === 2 ? gl.DEPTH24_STENCIL8 : gl.DEPTH_STENCIL;
            gl.renderbufferStorage(
                gl.RENDERBUFFER,
                format,
                glRenderTarget.width,
                glRenderTarget.height
            );
        }
    }
}