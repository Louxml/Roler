


import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { Runner } from "../../../../runner/Runner.js";
import { System } from "../system/System.js";
import { CanvasSource } from "../../shared/texture/sources/CanvasSource.js";
import { getCanvasTexture } from "../../shared/texture/utils/getCanvasTexture.js";
import { RenderTarget } from "./RenderTarget.js";
import { TextureSource } from "../texture/sources/TextureSource.js";
import { Color } from "../../../../color/Color.js";
import { Mat3 } from "../../../../maths/matrix/Mat3.js";
import { CLEAR } from "../../gl/texture/const.js";



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
    #viewport = new Rectangle();


    /** renderTarget改变 运行器 */
    #onRenderTargetChange = new Runner('onRenderTargetChange');

    /** 默认清除颜色 */
    #defaultClearColor = new Color();

    /** 默认投影矩阵 */
    #projectMatrix = new Mat3();



    /** 渲染目标栈，用于保存渲染目标 */
    #renderTargetStack = [];

    /** 渲染目标存储Hash, source -> RenderTarget */
    #renderTargetHash = new Map();

    /** RenderTarget.uid -> GpuRenderTarget */
    #gpuRenderTargetHash = Object.create(null);



    contextChange(){
        this.#gpuRenderTargetHash = Object.create(null);
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
     * @param {RenderTarget | TextureSource} options.target 渲染目标
     * @param {Number} options.clear 清空渲染目标，CLEAR.NONE:不清空，CLEAR.COLOR:清空颜色，CLEAR.DEPTH:清空深度，CLEAR.STENCIL:清空模板，可组合使用
     * @param {Color} options.clearColor 清空颜色
     * @param {Rectangle} options.frame 视口区域
     */
    renderStart({target, clear, clearColor, frame}){
        // 清空渲染目标栈
        this.#renderTargetStack.length = 0;

        this.push(target, clear, clearColor, frame);

        this.rootViewport.copyFrom(this.viewport);
        this.rootRenderTarget = this.renderTarget;
        this.renderingToScreen = this.#isRenderingToScreen(this.rootRenderTarget);
    }

    /**
     * 绑定渲染目标
     * @param {RenderTarget | TextureSource} target 渲染目标
     * @param {Number} clear 清除缓冲区，CLEAR.NONE:不清空，CLEAR.COLOR:清空颜色，CLEAR.DEPTH:清空深度，CLEAR.STENCIL:清空模板，可组合使用
     * @param {Color} clearColor 清除颜色
     * @param {Rectangle} frame 视口大小
     * @returns {RenderTarget} 渲染目标对象
     */
    bind(target, clear, clearColor, frame){
        const renderTarget = this.getRenderTarget(target);

        const isChange = this.renderTarget !== renderTarget;

        this.renderTarget = renderTarget;
        
        const gpuRenderTarget = this.getGpuRenderTarget(renderTarget);

        if (renderTarget.pixelWidth !== gpuRenderTarget.width || renderTarget.pixelHeight !== gpuRenderTarget.height){
            this.adaptor.resizeGpuRenderTarget(renderTarget);
        }

        const viewport = this.#viewport;

        if (!frame && target instanceof Texture){
            frame = target.frame;
        }

        if (frame){
            // 更新视口
            const resolution = renderTarget.resolution;
            viewport.set(
                (frame.x * resolution.x + 0.5) | 0, 
                (frame.y * resolution.y + 0.5) | 0,
                (frame.width * resolution.x + 0.5) | 0,
                (frame.height * resolution.y + 0.5) | 0
            );
        }else{
            viewport.set(0, 0, renderTarget.pixelWidth, renderTarget.pixelHeight);
        }

        // 计算投影矩阵
        this.#calculateProject(0, 0, viewport.width / renderTarget.resolution, viewport.height / renderTarget.resolution, renderTarget.isRoot);

        // 开始渲染过程，准备
        this.adaptor.startRenderPass(renderTarget, clear, clearColor, viewport);

        // 通知渲染目标改变
        if (isChange) this.onRenderTargetChange.emit(renderTarget);

        return renderTarget;
    }

    /**
     * 清除渲染目标的缓冲区
     * @param {RenderTarget | TextureSource} target 渲染目标，如果为空，则使用当前渲染目标
     * @param {Number} clear 清除缓冲区
     * @param {Color} clearColor 清除颜色
     * @returns 
     */
    clear(target, clear = CLEAR.ALL, clearColor){
        if (!clear) return;

        const renderTarget = target ? this.getRenderTarget(target) : this.renderTarget;

        this.adaptor.clear(
            renderTarget,
            clear,
            clearColor,
            this.viewport
        );
    }


    /**
     * 添加渲染目标，并且绑定渲染目标
     * @param {RenderTarget | TextureSource} target 渲染目标
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

        this.bind(currentRenderTarget.renderTarget, CLEAR.NONE, null, currentRenderTarget.frame);
    }


    /**
     * 获取渲染目标
     * @param {Texture | TextureSource | RenderTarget} target 渲染目标
     * @returns {RenderTarget} 渲染目标对象
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


    /**
     * 将渲染目标对象渲染结果复制到纹理对象中
     * @param {RenderTarget} renderTarget 渲染目标对象
     * @param {Texture} texture 复制到的目标纹理
     * @param {x:Number,y:Number} originSrc 源渲染目标的起始坐标
     * @param {width:Number,height:Number} size 源渲染目标的尺寸
     * @param {x:Number,y:Number} originDest 目标纹理的起始坐标
     * @returns {Texture} 返回目标纹理
     */
    copyToTexture(renderTarget, texture, originSrc, size, originDst){

        // 边界处理
        if (originSrc.x < 0){
            size.width += originSrc.x;
            originDst.x -= originSrc.x;
            originSrc.x = 0;
        }
        if (originSrc.y < 0){
            size.height += originSrc.y;
            originDst.y -= originSrc.y;
            originSrc.y = 0;
        }

        const { pixelWidth, pixelHeight } = renderTarget;
        size.width = Math.min(size.width, pixelWidth - originSrc.x);
        size.height = Math.min(size.height, pixelHeight - originSrc.y);

        return this.adaptor.copyToTexture(renderTarget, texture, originSrc, size, originDst);
    }

    /**
     * 确保当前渲染目标有深度缓冲区
     */
    ensureDepthStencil(){
        if (!this.renderTarget.stencil){
            this.renderTarget.stencil = true;
            this.adaptor.startRenderPass(this.renderTarget, CLEAR.NONE, null, this.viewport);
        }
    }


    /**
     * 创建渲染目标
     * @param {TextureSource | CanvasSource | RenderTarget} target 
     * @returns {RenderTarget}
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

    /**
     * 计算投影矩阵
     * @param {Number} x 视口x坐标
     * @param {Number} y 视口y坐标
     * @param {Number} width 视口宽度
     * @param {Number} height 视口高度
     * @param {Boolean} flipY 是否y轴翻转
     */
    #calculateProject(x, y, width, height, flipY){
        const sign = flipY ? -1 : 1;
        const a = 2 / width;
        const b = 2 / height * sign;

        const arr = [
            a, 0, -1 - x * a,
            0, b, -sign - y * b,
            0, 0, 1
        ];

        this.#projectMatrix.set(arr);
    }


    destroy(){
        this.#renderTargetHash.forEach((renderTarget, key) => {
            // TODO 这里为什么要判断key !== renderTarget就销毁，相等的要保留吗？
            renderTarget.destroy();
        })

        this.#renderTargetHash.clear();

        this.#gpuRenderTargetHash = Object.create(null);
    }
    
    get viewport(){
        return this.#viewport;
    }

    get defaultClearColor(){
        return this.#defaultClearColor;
    }

    get onRenderTargetChange(){
        return this.#onRenderTargetChange;
    }
}