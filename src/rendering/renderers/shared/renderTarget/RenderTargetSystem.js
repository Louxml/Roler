


import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { Runner } from "../../../../runner/Runner.js";
import { System } from "../system/System.js";
import { CanvasSource } from "../../shared/texture/sources/CanvasSource.js";
import { getCanvasTexture } from "../../shared/texture/utils/getCanvasTexture.js";
import { RenderTarget } from "./RenderTarget.js";
import { TextureSource } from "../texture/sources/TextureSource.js";



export class RenderTargetAdaptor {

    init(renderer, renderTargetSystem){}

    copyToTexture(renderTarget, texture, originSrc, size, originDest){}

    startRenderPass(renderTarget, clear, clearColor, viewport){}

    finishRenderPass(renderTarget){}

    clear(renderTarget, clear, clearColor){}

    createGpuRenderTarget(renderTarget){}

    destroyGpuRenderTarget(renderTarget){}

    resizeGpuRenderTarget(renderTarget){}

}


export class RenderTargetSystem extends System {

    /** 根渲染目标 */
    rootRenderTarget;
    /** 渲染过程的根视口 */
    rootViewport = new Rectangle();
    /** 是否渲染到屏幕上 */
    renderingToScreen;
    /** 当前激活的渲染目标 */
    renderTarget;
    /** 当前激活的渲染目标的视口 */
    viewport;


    /** renderTarget改变 运行器 */
    #onRenderTargetChange = new Runner('onRenderTargetChange');

    /** 渲染目标栈，用于保存渲染目标 */
    #renderTargetStack = [];

    /** 渲染目标存储Hash, source -> RenderTarget */
    #renderTargetHash = new Map();

    /** RenderTarget.uid -> GpuRenderTarget */
    #gpuRenderTargetHash = Object.create();

    contextChange(){
        this.#gpuRenderTargetHash = Object.create(null);

        // test
        // this.renderStart({});
    }

    /**
     * 完成渲染过程
     */
    finishRenderPass(){
        this.adaptor.finishRenderPass(this.renderTarget);
    }

    /**
     * 当开始渲染场景是调用
     * @param {Object} options 配置
     * @param {RenderTarget} options.target 渲染目标
     * @param {Number} options.clear 清空渲染目标，CLEAR.NONE:不清空，CLEAR.COLOR:清空颜色，CLEAR.DEPTH:清空深度，CLEAR.STENCIL:清空模板，可组合使用
     * @param {Color} options.clearColor 清空颜色
     * @param {Rectangle} options.frame 视口区域
     */
    renderStart({target, clear, clearColor, frame}){
        // 清空渲染目标栈
        this.#renderTargetStack.length = 0;

        this.push(target, clear, clearColor, frame);

        // this.rootViewport.copyFrom(this.viewport);
        // this.rootRenderTarget = this.renderTarget;
        // this.renderingToScreen = this.#isRenderingToScreen(this.rootRenderTarget);
    }

    bind(target, clear, clearColor, frame){
        const renderTarget = this.getRenderTarget(target);

        return renderTarget;
    }

    clear(target, clear, clearColor){
        // TODO 
    }


    /**
     * 添加渲染目标，并且绑定渲染目标
     * @param {RenderTarget} target 渲染目标
     * @param {Number} clear 清空渲染目标
     * @param {Color} clearColor 清空颜色
     * @param {Rectangle} frame 视口区域
     * @returns {RenderTarget} 返回渲染目标
     */
    push(target, clear, clearColor, frame){
        const renderTarget = this.bind(target, clear, clearColor, frame);

        this.#renderTargetStack.push({
            renderTarget,
            frame
        });

        return renderTarget;
    }

    /**
     * 移除栈顶渲染目标，恢复上一个渲染目标
     */
    pop(){
        this.#renderTargetStack.pop();

        const currentRenderTarget = this.#renderTargetStack[this.#renderTargetStack.length - 1];

        this.bind(currentRenderTarget.renderTarget, 0, null, currentRenderTarget.frame);
    }


    /**
     * 获取渲染目标
     * @param {Texture} target 纹理
     * @returns {RenderTarget} 渲染目标
     */
    getRenderTarget(target){
        if (target.isTexture){
            target = target.source;
        }

        return this.#renderTargetHash.get(target) ?? this.#createRenderTarget(target);
    }

    getGpuRenderTarget(renderTarget){
        return this.#gpuRenderTargetHash[renderTarget.uid] ??= this.adaptor.createGpuRenderTarget(renderTarget);
    }


    copyToTexture(){

    }


    /**
     * 创建渲染目标
     * @param {TextureSource} target 
     */
    #createRenderTarget(target){
        let renderTarget = null;
        if (CanvasSource.test(target)){
            // TextureSource
            target = getCanvasTexture(target).source;
        }

        if (target instanceof RenderTarget){
            renderTarget = target;
        } else if (target instanceof TextureSource){
            renderTarget = new RenderTarget({
                colorTextures: [target],
            });

            if (CanvasSource.test(target.resource)){
                renderTarget.isRoot = true;
            }

            // target 添加destroy事件监听,TextureSource销毁时
            target.once('destroy', () => {
                // 销毁RenderTarget
                renderTarget.destroy();

                // 销毁GPU资源
                const gpuRenderTarget = this.#gpuRenderTargetHash[renderTarget.uid];
                if (gpuRenderTarget){
                    this.#gpuRenderTargetHash[renderTarget.uid] = null;
                    this.adaptor.destroyGpuRenderTarget(gpuRenderTarget);
                }
            });
        } else {
            throw new Error('RenderTargetSystem: Invalid target');
        }

        this.#renderTargetHash.set(target, renderTarget)
        
        return renderTarget;
    }

    /**
     * 检查渲染目标是否在屏幕上,canvas渲染目标是否在HTML上
     * @param {RenderTarget} renderTarget 
     * @returns 
     */
    #isRenderingToScreen(renderTarget){
        // 检查renderTarget是不是在屏幕上
        const resource = renderTarget.colorTexture.resource;
        return (resource instanceof globalThis.HTMLCanvasElement) && document.body.contains(resource);
    }


    destroy(){
        // this.#renderTargetHash.forEach((renderTarget, key) => {
            
        // })
    }
}