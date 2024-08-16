import { ExtensionType } from "../../../../extensions/index.js";
import { Shader } from "../../shared/shader/Shader.js";
import { UniformGroup } from "../../shared/shader/UniformGroup.js";
import { System } from "../../shared/system/System.js";
import { GLProgram } from "./GLProgram.js";
import { generateProgram } from "./utils/generateProgram.js";
import { generateShaderSyncFunction } from "./utils/generateShaderSyncFunction.js";


const defaultSyncData = {
    textureCount: 0,
    blockIndex: 0,
}


export class GLShaderSystem extends System {

    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'shader'
    }

    /** 当前激活的GLProgram */
    #activeProgram;

    #gl;

    #maxBindings

    #programDataHash;

    /**
     * 绑定Uniforms的id对应的索引位置
     */
    #boundUniformsIdsToIndexHash;

    /**
     * 当前位置绑定的uniformGroup
     */
    #boundIndexToUniformsHash;

    /**
     * 下一个绑定索引位置
     */
    #nextIndex = 0;

    /**
     * shader同步函数
     */
    #shaderSyncFunctions = Object.create(null);


    init(){
        console.log('GLShaderSystem init');
    }

    contextChange(gl){
        this.#gl = gl;

        this.#maxBindings = gl.MAX_UNIFORM_BUFFER_BINDINGS ? gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS) : 0;

        // console.log(this.#maxBindings);

        this.#programDataHash = Object.create(null);
        this.#boundUniformsIdsToIndexHash = Object.create(null);
        this.#boundIndexToUniformsHash = Object.create(null);

        this.#shaderSyncFunctions = Object.create(null);
        this.#activeProgram = null;
    }


    /**
     * 绑定Shader，并处理数据同步（处理Unifrom数据）
     * @param {Shader} shader 要绑定的Shader对象
     * @param {Boolean} skipSync 是否跳过数据同步。默认false，执行数据同步代码上传数据至GPU
     * @returns 
     */
    bind(shader, skipSync = false){
        this.#setProgram(shader.glProgram);

        if (skipSync) return;

        const key = shader.glProgram.key;

        // TODO 这个数据暂时没有到
        defaultSyncData.textureCount = 0;
        defaultSyncData.blockIndex = 0;

        const syncFunction = this.#shaderSyncFunctions[key] ??= this.#generateShaderSyncFunction(shader, this);

        syncFunction(this.renderer, shader, defaultSyncData);
    }

    /**
     * 更新当前激活Shader的UniformGroup，并上传数据至GPU
     * @param {UniformGroup} uniformGroup 
     */
    updateUniformGroup(uniformGroup){
        this.renderer.uniformGroup.updateUniformGroup(uniformGroup, this.#activeProgram, defaultSyncData);
    }

    /**
     * 绑定资源中的数据到 当前Shader中指定的uniform block，并指定位置
     * @param {BufferResource} uniformGroup 
     * @param {String} name uniform block的名字
     * @param {Number} index 位置
     * @returns 
     */
    bindUniformBlock(uniformGroup, name, index = 0){

        if (this.renderer.context.webGLVersion === 1){
            throw new Error('WebGL1.0 not support');
        }
        
        const bufferSystem = this.renderer.buffer;
        const programData = this._getProgramData(this.#activeProgram);

        const isBufferResource = uniformGroup.isBufferResource;

        if (isBufferResource){
            // TODO uboSystem
            // this.renderer.ubo.updateUniformGroup(uniformGroup);
        }
        
        // 更新Buffer数据
        bufferSystem.updateBuffer(uniformGroup.buffer);

        let boundIndex = this.#boundUniformsIdsToIndexHash[uniformGroup.uid];

        // 如果uniformGroup没有绑定过，则绑定
        if (boundIndex === undefined){
            const nextIndex = this.#nextIndex++ % this.#maxBindings;

            // 当前位置已绑定其他UniformGroup，则解绑
            const currentUniformGroup = this.#boundIndexToUniformsHash[nextIndex];
            if (currentUniformGroup){
                this.#boundUniformsIdsToIndexHash[currentUniformGroup.uid] = undefined;
            }

            // 绑定
            boundIndex = this.#boundUniformsIdsToIndexHash[uniformGroup.uid] = nextIndex;
            this.#boundIndexToUniformsHash[nextIndex] = uniformGroup;

            if (isBufferResource){
                // 这里没用到BufferResource.size，是不是统一大小256？
                bufferSystem.bindBufferRange(uniformGroup.buffer, nextIndex, uniformGroup.offset);
            }else{
                bufferSystem.bindBufferBase(uniformGroup.buffer, nextIndex);
            }
        }

        const gl = this.#gl;

        const uniformBlockIndex = this.#activeProgram._uniformBlockData[name].index;

        // program中(index ?) 对应的buffer绑定所在位置
        if (programData.uniformBlockBindings[index] === boundIndex) return;
        programData.uniformBlockBindings[index] = boundIndex;
        
        // 绑定
        gl.uniformBlockBinding(programData.program, uniformBlockIndex, boundIndex);
    }

    /**
     * 设置当前激活的GLProgram，并使用WebGLProgram
     * @param {GLProgram} program 
     * @returns 
     */
    #setProgram(program){
        if (this.#activeProgram === program) return;

        this.#activeProgram = program;

        const programData = this._getProgramData(program);

        this.#gl.useProgram(programData.program);
    }

    /**
     * 查找缓存中的GLProgramData对象, 如果没有则创建
     * @param {GLProgram} program 
     * @returns 
     */
    _getProgramData(program){
        return this.#programDataHash[program.key] || this.#createProgramData(program);
    }

    /**
     * 创建GLProgramData对象, 并编译Shader
     * @param {GLProgram} program GLProgram对象
     * @returns GLProgramData对象
     */
    #createProgramData(program){
        const key = program.key;

        return this.#programDataHash[key] = generateProgram(this.#gl, program);
    }

    #generateShaderSyncFunction(shader, shaderSystem){
        return generateShaderSyncFunction(shader, shaderSystem);
    }


    destroy(){
        //TODO
        for (const key of Object.keys(this.#programDataHash)) {
            
            const programData = this.#programDataHash[key];

            programData.destroy();

            delete this.#programDataHash[key];
        }

        this.#programDataHash = null;
    }

    get gl(){
        return this.#gl;
    }

    get activeProgram(){
        return this.#activeProgram;
    }
} 