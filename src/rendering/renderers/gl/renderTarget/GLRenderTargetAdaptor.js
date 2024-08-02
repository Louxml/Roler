

import { Color } from "../../../../color/Color.js";
import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { RenderTarget } from "../../shared/renderTarget/RenderTarget.js";
import { RenderTargetAdaptor } from "../../shared/renderTarget/RenderTargetSystem.js";
import { GLRenderTarget } from "./GLRenderTarget.js";


export class GLRenderTargetAdaptor extends RenderTargetAdaptor {
    

    #renderTargetSystem;

    #renderer;

    #clearColorCache = new Color();

    #viewportCache = new Rectangle();

    init(renderer, renderTargetSystem){
        this.#renderer = renderer;
        this.#renderTargetSystem = renderTargetSystem;

        renderer.runners.contextChange.add(this);
    }

    contextChange(){
        this.#clearColorCache = new Color();
        this.#viewportCache = new Rectangle();
    }

    copyToTexture(renderTarget, texture, originSrc, size, originDest){
        // TODO
    }

    startRenderPass(renderTarget, clear, clearColor, viewport){
        // TODO
    }

    finishRenderPass(renderTarget){
        // TODO 
    }

    clear(renderTarget, clear, clearColor){

    }

    /**
     * 创建GLRenderTarget
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
     * 销毁GLRenderTarget
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


    resizeGpuRenderTarget(renderTarget){
        // TODO
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

        const isSupportMSAA = renderer.context.supports.msaa;
        

        // 绑定每一个纹理，关联到WebGLFramebuffer
        renderTarget.colorTextures.forEach((source, i) => {
            if (source.antialias){
                if (isSupportMSAA){
                    glRenderTarget.msaa = true;
                }else{
                    console.warn("当前WebGL环境不支持MSAA");
                }
            }

            // 绑定TextureSource，为什么不用bind，不需要bind里的独立采样器吗？
            renderer.texture.bindSource(source, 0);

            const glSource = renderer.texture.getGLSource(source);

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
     * 重置颜色纹理的大小？，处理msaa抗锯齿
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
}