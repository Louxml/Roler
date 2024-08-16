


import { ExtensionType } from "../../../../extensions/index.js";
import { GpuStencilModes, STENCIL_MODES } from "../../shared/state/const.js";
import { System } from "../../shared/system/System.js";
import { STENCIL_COMPARE_MODES, STENCIL_OPERATE_MODES } from "./const.js";


export class GLStencilSystem extends System {
    
    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'stencil'
    }

    #gl;

    /**
     * 当前模板状态
     */
    #stencilCache = {
        enabled: false,
        stencilReference: 0,
        stencilMode: STENCIL_MODES.NONE
    }

    #activeRenderTarget;

    /**
     * renderTarget对应的模板状态
     * @type {Object}
     */
    #renderTargetStencilState = Object.create(null);

    constructor(renderer){
        super(renderer);

        renderer.renderTarget.onRenderTargetChange.add(this);
    }

    contextChange(gl){
        console.log('GLStencilSystem init');

        this.#gl = gl;

        this.#stencilCache.enabled = false;
        this.#stencilCache.stencilMode = STENCIL_MODES.NONE;
        this.#stencilCache.stencilReference = 0;
    }

    onRenderTargetChange(renderTarget){
        if (this.#activeRenderTarget === renderTarget) return;

        this.#activeRenderTarget = renderTarget;

        const stencilState = this.#renderTargetStencilState[renderTarget.uid] ??= {
            stencilMode: STENCIL_MODES.NONE,
            stencilReference: 0
        };
        
        this.setStencilMode(stencilState.stencilMode, stencilState.stencilReference);
    }

    /**
     * 设置当前渲染目标的模板模式
     * @param {Number} stencilMode 
     * @param {Number} stencilReference 
     */
    setStencilMode(stencilMode, stencilReference){
        const stencilState = this.#renderTargetStencilState[this.#activeRenderTarget.uid];

        const gl = this.#gl;
        const mode = GpuStencilModes[stencilMode];

        const stencilCache = this.#stencilCache;

        // 设置当前渲染目标的模板模式
        stencilState.stencilMode = stencilMode;
        stencilState.stencilReference = stencilReference;

        if (stencilMode === STENCIL_MODES.DISABLED){
            // 关闭模板测试
            if (stencilCache.enabled){
                stencilCache.enabled = false;
                gl.disable(gl.STENCIL_TEST);
            }
            return;
        }

        // 开启模板测试
        if (!stencilCache.enabled){
            stencilCache.enabled = true;
            gl.enable(gl.STENCIL_TEST);
        }

        // 设置模板模式（与当前值不一致时）
        if (stencilMode !== stateCache.stencilMode || stencilReference !== stateCache.stencilReference){
            stateCache.stencilMode = stencilMode;
            stateCache.stencilReference = stencilReference;

            gl.stencilFunc(STENCIL_COMPARE_MODES[mode.stencilBack.compare], stencilReference, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, STENCIL_OPERATE_MODES[mode.stencilBack.passOp]);
        }
    }

    destroy(){
        // TODO 需要移除吗？
        // this.renderer.renderTarget.onRenderTargetChange.remove(this);
    }
}