

import { UniformGroup } from "../shader/UniformGroup.js";
import { System } from "../system/System.js";
import { Buffer } from "../buffer/Buffer.js";
import { BufferUsage } from "../buffer/const.js";


export class UboSystem extends System {

    #adaptor;

    #syncFunctionHash = Object.create(null);
    
    constructor(renderer, adaptor){
        super(renderer);

        this.#adaptor = adaptor;

        // TODO 检查是否支持 unsafe-eval (new Function)
    }

    /**
     * 确保uniformGroup的buffer已经创建
     * @param {UniformGroup} uniformGroup 
     */
    ensureUniformGroup(uniformGroup){
        const uniformData = this.getUniformGroupData(uniformGroup);

        uniformGroup.buffer ??= new Buffer({
            data: new Float32Array(uniformData.layout.size / 4),
            usage: BufferUsage.UNIFORM | BufferUsage.COPY_DST
        });
    }


    /**
     * 获取uniformGroup签名对应的同步函数数据对象(包含布局及同步函数),如果没有则创建
     * @param {UniformGroup} uniformGroup uniformGroup对象
     */
    getUniformGroupData(uniformGroup){
        return this.#syncFunctionHash[uniformGroup.signature] ??= this.#createUniformGroup(uniformGroup);
    }

    /**
     * 创建UniformGroup数据对象,包含布局及同步函数
     * @param {UniformGroup} uniformGroup 
     */
    #createUniformGroup(uniformGroup){
        const signature = uniformGroup.signature;

        let uniformData = this.#syncFunctionHash[signature];

        if (!uniformData){
            const elements = Object.values(uniformGroup.uniformStructures);

            const layout = this.#adaptor.createUboElements(elements);

            const syncFunction = this.#generateUboSync(layout.uboElements);

            uniformData = {
                layout,
                syncFunction
            }
        }

        return uniformData;
    }

    /**
     * 生成同步函数
     * @param {UboElements} uboElements 
     * @returns 
     */
    #generateUboSync(uboElements){
        return this.#adaptor.generateUboSync(uboElements);
    }


    /**
     * 同步uniformGroup数据到buffer
     * @param {UniformGroup} uniformGroup 
     * @param {TypeArray} data 
     * @param {Number} offset 
     * @returns 
     */
    syncUniformGroup(uniformGroup, data, offset = 0){
        this.ensureUniformGroup(uniformGroup);

        const uniformGroupData = this.getUniformGroupData(uniformGroup);

        data ??= uniformGroupData.buffer.data;

        uniformGroupData.syncFunction(uniformGroup.uniforms, data, offset);

        return true;
    }

    /**
     * 更新uniformGroup,并且更新Buffer
     * @param {UniformGroup} uniformGroup 
     */
    updateUniformGroup(uniformGroup){
        if (uniformGroup.isStatic && !uniformGroup.updateID) return false;
        uniformGroup.updateID = 0;

        // 更新uniformGroup
        const synced = this.syncUniformGroup(uniformGroup);

        // buffer更新
        uniformGroup.buffer.update();

        return synced;
    }

    destroy(){
        this.#syncFunctionHash = null;
    }
}