

import { Program, System } from "../index.js";
import { Extension, ExtensionType } from "../../../extensions/src/index.js";

import { generateProgram } from "./utils/generateProgram.js";
import { generateUniformsSync } from "./utils/generateUniformsSync.js";
import { Shader } from "./Shader.js";
import { UniformGroup } from "./UniformGroup.js";

const defaultSyncData = {
    textureCount: 0,
    uboCount: 0
}

export class ShaderSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "shader",
        priority: 0
    }

    /**
     * 渲染器对象
     * @public
     */
    renderer;

    /**
     * 当前shader
     * @public
     */
    shader;

    /**
     * gl
     */
    gl;

    /**
     * 缓存方法
     * @private
     */
    cache;

    constructor(renderer){
        super();

        this.renderer = renderer;
        this.gl = null;
        this.shader = null;
        
        this.cache = {};
    }

    init(){
        console.log(`Shader System`);
    }

    contextChange(){
        this.gl = this.renderer.gl;

        this.reset();


        // TODO test
        let program = new Program();
        let shader = new Shader(program);
        this.bind(shader);

        this.setUniforms([1,2,3,4])
    }

    /**
     * 绑定Shader
     * @param {Shader} shader shader对象
     * @param {Boolean} isAsync 是否异步
     * @returns GLProgram对象
     */
    bind(shader, isAsync){
        shader.disposeRunner.add(this);

        const gl = this.gl;
        // TODO 这里为什么用最新的上下文
        const CONTEXT_UID = this.renderer.CONTEXT_UID;
        const program = shader.program;
        const glProgram = program.glPrograms[CONTEXT_UID] || this.generateProgram(shader);

        this.shader = shader;

        gl.useProgram(glProgram.program);

        // TODO 同步的用处？
        if (!isAsync){
            defaultSyncData.textureCount = 0;
            defaultSyncData.uboCount = 0;

            this.syncUniformGroup(shader.uniformGroup, defaultSyncData);
        }

        return glProgram;
    }

    // TODO 没写完
    setUniforms(uniforms){
        const CONTEXT_UID = this.renderer.CONTEXT_UID;

        const shader = this.shader.program;
        const glProgram = shader.glPrograms[CONTEXT_UID];
        // TODO 同步绑定数据
    }

    // 同步uniformGroup
    syncUniformGroup(group, syncData){
        
        const glProgram = this.getGLProgram();

        if (!group.static || group.updateID !== glProgram.uniformUpdateGroups[group.id]){
            glProgram.uniformUpdateGroups[group.id] = group.updateID;

            this.syncUniforms(group, glProgram, syncData);

        }

    }

    syncUniforms(group, glProgram, syncData){
        const syncFUnc = group.syncUniforms[this.shader.program.id] || this.createSyncGroups(group);
    }

    /**
     * 创建同步uniformgroup方法
     * @param {UniformGroup} group 
     * @returns Function
     */
    createSyncGroups(group){

        const id = this.getSignature(group, this.shader.program.uniformData, "u");

        if (!this.cache[id]) {
            this.cache[id] = generateUniformsSync(group, this.shader.program.uniformData);
        }

        group.syncUniforms[this.shader.program.id] = this.cache[id];
        
        return group.syncUniforms[this.shader.program.id];
    }

    /**
     * 获取签名
     * @param {UniformGroup} group 
     * @param {Object} unifromData 
     * @param {String} preFix 前缀
     */
    getSignature(group, unifromData, preFix){
        const uniforms = group.uniforms;

        const str = [`${preFix}-`];

        console.log(uniforms);

        for (const i in uniforms){
            str.push(i);

            if (unifromData[i]){
                str.push(unifromData[i].type);
            }
        }

        return str.join("-");
    }

    /**
     * 获取当前shader的GLProgram
     * @returns GLProgram
     */
    getGLProgram(){
        if (this.shader){
            return this.shader.program.glPrograms[this.renderer.CONTEXT_UID];
        }
        return null;
    }

    /**
     * 生成GLProgram对象
     * @param {Shader} shader Shader对象
     * @public
     * @returns GLProgram对象
     */
    generateProgram(shader){
        const gl = this.gl;
        const CONTEXT_UID = this.renderer.CONTEXT_UID;
        const program = shader.program;

        const glProgram = generateProgram(gl, program);

        program.glPrograms[CONTEXT_UID] = glProgram;

        return glProgram;
    }

    /**
     * 处置shader对象
     * @param {Shader} shader shader对象
     */
    dispose(shader){
        if (this.shader === shader){
            this.shader = null;
        }
    }

    reset(){
        this.shader = null;
    }

    destroy(){
        this.renderer = null;
        this.gl = null;
        this.shader = null;
    }

}

Extension.add(ShaderSystem);