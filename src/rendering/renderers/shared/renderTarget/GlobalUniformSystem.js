

import { ExtensionType } from "../../../../extensions/index.js";
import { RendererType } from "../../types.js";
import { System } from "../system/System.js";


export class GlobalUniformSystem extends System {

    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'globalUniforms'
    }

    #stackIndex = 0;

    #globalUniformDataStack = [];

    #uniformsPool = [];
    #activeUniforms = [];

    #bindGroupPool = [];
    #activeBindGroup = [];

    #currentGlobalUniformData = null;

    init(){
        console.log('GlobalUniformSystem init');
    }
    
    /**
     * 清空当前活动的uniform和 bindGroup
     */
    reset(){
        this.#stackIndex = 0;

        for (let i = 0; i < this.#activeUniforms.length; i++) {
            this.#uniformsPool.push(this.#activeUniforms[i]);
        }

        for (let i = 0; i < this.#activeBindGroup.length; i++) {
            this.#bindGroupPool.push(this.#activeBindGroup[i]);
        }

        this.#activeUniforms.length = 0;
        this.#activeBindGroup.length = 0;
            
    }

    /**
     * 
     * @param {Object} options 
     */
    start(options){
        this.reset();

        this.push(options);
    }

    bind({size, projectionMatrix, worldTransformMatrix, worldColor, offset}){
        // TODO renderTargetSystem

        // TODO renderPipes
    }

    push(options){
        this.bind(options);

        this.#globalUniformDataStack[this.#stackIndex++] = this.#currentGlobalUniformData;
    }

    pop(){
        if (this.#stackIndex <= 0)return;
        this.#currentGlobalUniformData = this.#globalUniformDataStack[--this.#stackIndex - 1];

        if (this.renderer.type === RendererType.WEBGL){
            // TOOD 需要更新 BindGroup
        }
    }
}