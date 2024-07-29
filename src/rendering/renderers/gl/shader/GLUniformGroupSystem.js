

import { ExtensionType } from "../../../../extensions/index.js";
import { UniformGroup } from "../../shared/shader/UniformGroup.js";
import { System } from "../../shared/system/System.js";
import { GLProgram } from "./GLProgram.js";
import { generateUniformSyncFunction } from "./utils/generateUniformSyncFunction.js";


export class GLUniformGroupSystem extends System{
    
    /** @ignore */
    static extension = {
        type: ExtensionType.WebGLSystem,
        name: 'uniformGroup'
    }

    /**
     * webgl上下文
     */
    #gl;

    /**
     * uniformGroup和program绑定的同步函数
     */
    #uniformGroupSyncHash = Object.create(null);

    /**
     * 传入数据和接受数据对应的同步函数
     * 不同的uniformGroup和Program数据格式一样可复用同步代码
     */
    #cache = Object.create(null);

    init(){
        console.log('GLUniformGroupSystem init');
    }

    
    contextChange(gl){
        this.#gl = gl;
    }


    /**
     * 更新UniformGroup上传数据至GLProgram
     * @param {UniformGroup} group 数据
     * @param {GLProgram} program 上传数据的GLProgram
     * @param {Object} syncData 
     */
    updateUniformGroup(group, program, syncData){
        const programData = this.renderer.shader._getProgramData(program);

        if (!group.isStatic || group.updateID != programData.uniformGroupUpdateIds[group.uid]){
            programData.uniformGroupUpdateIds[group.uid] = group.updateID;

            const syncFunc = this.#getUniformSyncFunction(group, program);

            syncFunc(programData.uniformData, group.uniforms, this.renderer, syncData);
        }
    }

    /**
     * 获取Uniform同步函数， group.signature和program.key所绑定的函数方法
     * @param {UniformGroup} group 
     * @param {GLProgram} program 
     * @returns 
     */
    #getUniformSyncFunction(group, program){
        return this.#uniformGroupSyncHash[group.signature]?.[program.key] || this.#createUniformSyncFunction(group, program);
    }

    #createUniformSyncFunction(group, program){
        const uniformGroupSyncHash = this.#uniformGroupSyncHash[group.signature] ??= {};

        // 获取传入数据和uniform接收数据格式生成的签名
        const signature = this.#getSignature(group, program._uniformData, 'u');

        // 缓存相同字段和格式的同步函数，不同的Uniform和Program，但是数据格式一样，可复用
        const syncFunc = this.#cache[signature] ??= this.#generateUniformSync(group, program._uniformData);

        uniformGroupSyncHash[group.signature] = syncFunc;

        return syncFunc;
    }

    #generateUniformSync(group, uniformData){
        return generateUniformSyncFunction(group, uniformData);
    }


    /**
     * 获取唯一签名
     * @param {UniformGroup} group 
     * @param {Object} uniformData 
     * @param {String} preFix 签名前缀
     */
    #getSignature(group, uniformData, preFix){
        const uniforms = group.uniforms;

        const strings = [`${preFix}`];

        for (const name in uniforms){
            let k = name;
            
            if (uniformData[name]){
                k = `${name}:${uniformData[name].type}`;
            }
            strings.push(k);
        }

        return strings.join('-');
    }

    destroy(){
        this.renderer = null;
        this.#gl = null;
    }


    get gl(){
        return this.#gl;
    }
}