import { EventEmitter } from "../../../../eventemitter/EventEmtter.js";
import { GLProgram } from "../../gl/shader/GLProgram.js";
import { BindGroup } from "../../gpu/shader/BindGroup.js";
import { RendererType } from "../../types.js";
import { UniformGroup } from "./UniformGroup.js";


export class Shader extends EventEmitter{

    /**
     * gpu program
     * @type {GPUProgram}
     */
    gpuProgram;

    /**
     * gl program
     * @type {GLProgram}
     */
    glProgram;

    /**
     * 资源
     */
    resources;

    /**
     * 兼容渲染类型
     * 0b00 都不兼容
     * 0b01 只兼容webgl
     * 0b10 只兼容gpu
     * @type {Numbwe}
     */
    #compatibleRenderers;

    /**
     * uniform 和 texture 的绑定关系
     */
    #uniformBindMap = Object.create(null);

    /**
     * owned bind groups
     */
    #ownedBindGroups = [];
    
    constructor(options = {}){
        super();

        let {
            gpuProgram,
            glProgram,
            compatibleRenderers,
            resources,
            groups,
            groupMap
        } = options;

        this.gpuProgram = gpuProgram;
        this.glProgram = glProgram;
        compatibleRenderers = compatibleRenderers ?? 0;

        // 设置渲染类型
        if (gpuProgram) compatibleRenderers |= RendererType.WEBGPU;
        if (glProgram) compatibleRenderers |= RendererType.WEBGL;
        this.#compatibleRenderers = compatibleRenderers;

        const nameHash = Object.create(null);



        if (!resources && !groups) resources = {};

        if (resources && groups) {
            throw new Error('[Shader]: resources and groups cannot be used at the same time.');
        }

        // TODO WebGPU处理

        // groupMap处理

        if (resources) {
            if (!gpuProgram) {
                groupMap = {}
                
                groups = {
                    99: new BindGroup(),
                }

                this.#ownedBindGroups.push(groups[99]);

                let bindTick = 0;

                for (const i in resources) {
                    nameHash[i] = { group: 99, binding: bindTick, name: i };

                    groupMap[99] ??= [];
                    groupMap[99][bindTick] = i;

                    bindTick++;
                }
            }else{
                // TODO WebGPU处理
            }

            // groups = {};

            for (const name in resources) {

                let value = resources[name];

                if (!value.source && !value.resourceType){
                    value = new UniformGroup(value);
                }

                const data = nameHash[name];

                if (data) {
                    if (!groups[data.group]) {
                        groups[data.group] = new BindGroup();
                        
                        this.#ownedBindGroups.push(groups[data.group]);
                    }
                    groups[data.group].setResource(value, data.binding);
                }
            }
        }

        this.groups = groups;
        this.#uniformBindMap= groupMap;

        this.resources = this.#bindResourceAccessor(groups, nameHash);
    }

    #bindResourceAccessor(groups, nameHash){
        const uniformsOut = {};

        for (const name in nameHash) {
            const data = nameHash[name];

            // TODO BindGroup
            Object.defineProperty(uniformsOut, data.name, {
                get(){
                    return groups[data.group].getResource(data.binding);
                },
                set(value){
                    groups[data.group].setResource(data.binding, value);
                }
            })
        }

        return uniformsOut;
    }

    /**
     * TODO
     * @param {String} name 
     * @param {Number} groupIndex 
     * @param {Number} bindIndex 
     */
    addResource(name, groupIndex, bindIndex){
        
    }

    destroy(destroyPrograms = false){
        this.emit('destroy', this);

        if (destroyPrograms) {
            this.gpuProgram?.destroy();
            this.glProgram?.destroy();
        }

        this.gpuProgram = null;
        this.glProgram = null;

        this.clear();

        this.#uniformBindMap = null;

        this.#ownedBindGroups.forEach((bindGroup) => {
            bindGroup.destroy();
        });
        
        this.#ownedBindGroups = null;

        this.groups = null;
        this.resources = null;

    }

    /**
     * 创建shader
     * @param {Object} options 配置
     * @returns {Shader}
     */
    static from(options){
        const { gpu, gl, ...rest } = options;

        // let gpuProgram = null;
        let glProgram = null;

        if (gl) {
            glProgram = GLProgram.from(gl);
        }

        return new Shader({
            gpuProgram,
            glProgram,
            ...rest
        });
    }
}