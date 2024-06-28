import { ExtensionType } from "../../../../extensions/index.js";
import { Geometry } from "../../shared/geometry/Geometry.js";
import { System } from "../../shared/system/System.js";


export class GLGeometrySystem extends System {
    
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'geometry',
    }

    hasVao;

    hasInstance;

    #gl;

    #activeGeometry;

    #activeVao;

    #geometryVaoHash;

    constructor(renderer){
        super(renderer);

        this.#activeGeometry = null;
        this.#activeVao = null;

        this.#geometryVaoHash = Object.create(null);

        this.hasVao = true;
        this.hasInstance = true;
    }

    init(){
        console.log("GLGeometrySystem init");
    }

    contextChange(gl){
        this.#gl = gl;
        
        const webGLVersion = this.renderer.context.webGLVersion;
        if (webGLVersion !== 2){

            const vertexArrayObject = this.renderer.context.extensions.vertexArrayObject
            gl.createVertexArray = vertexArrayObject?.createVertexArrayOES ?? (() => null);
            gl.bindVertexArray = vertexArrayObject?.bindVertexArrayOES ?? (() => null);
            gl.deleteVertexArray = vertexArrayObject?.deleteVertexArrayOES ?? (() => null);

            const instanceArray = this.renderer.context.extensions.vertexAttribDivisorANGLE;
            gl.drawArraysInstanced = instanceArray?.drawArraysInstancedANGLE ?? (() => null);
            gl.drawElementsInstanced = instanceArray?.drawElementsInstancedANGLE ?? (() => null);
            gl.vertexAttribDivisor = instanceArray?.vertexAttribDivisorANGLE ?? (() => null);
        }

        this.#activeGeometry = null;
        this.#activeVao = null;
    }

    bind(geometry, program){
        const gl = this.#gl;

        this.#activeGeometry = geometry;

        const vao = this.#getVao(geometry, program);

        // if (this.#activeVao !== vao){
        //     this.#activeVao = vao;

        //     gl.bindVertexArray(vao);
        // }

        // this.updateBuffers();
    }

    #getVao(geometry, program){
        return this.#geometryVaoHash[geometry.uid]?.[program._key] || this.#createVao(geometry, program);
    }

    /**
     * TODO
     * @param {geometry} geometry 
     * @param {GLProgram} program 
     */
    #createVao(geometry, program){
        const gl = this.#gl;
        
        const bufferSystem = this.renderer.buffer;

        // this.renderer.shader._getProgramData(program);

        // this.#checkCompatibility(geometry, program);

        // const signature = this.getSignature(geometry, program);

    }

    /**
     * 检查Geometry和Program是否兼容
     * @param {Geometry} geometry Geometry
     * @param {GLProgram} program Program
     * @returns
     */
    #checkCompatibility(geometry, program){
        const geometryAttributes = geometry.attributes;
        const shaderAttributes = program.attributes;

        // 几何属性必须包含shader属性
        for (const name in shaderAttributes){
            if (!geometryAttributes[name]){
                throw new Error(`Shader attribute "${name}" not found in Geometry`);
            }
        }
    }

    /**
     * TODO
     * 生成Geometry和Program的唯一签名
     * @param {*} geometry 
     * @param {*} program 
     */
    getSignature(geometry, program){
        const attributes = geometry.attributes;
        const shaderAttributes = program.attributes;

        const strings = ['g', geometry.uid];

        for (const name in attributes){
            if (shaderAttributes[name]){
                strings.push(name, attributes[name].location);
        }

        return strings.join('-');
    }
    }

    /**
     * 更新当前绑定的Geometry的Buffer
     */
    updateBuffers(){
        const gl = this.#gl;
        const geometry = this.#activeGeometry;
        
        const bufferSystem = this.renderer.buffer;

        for (let i = 0; i < geometry.buffers.length; i++){
            const buffer = geometry.buffers[i];

            bufferSystem.updateBuffer(buffer);
        }
    }


    draw(){

    }

    /**
     * 重置或解绑所有激活的VAO 和 Geometry
     */
    unbind(){
        this.#gl.bindVertexArray(null);
        this.#activeVao = null;
        this.#activeGeometry = null;
    }

    /**
     * 重置或解绑所有激活的VAO 和 Geometry
     */
    reset(){
        this.unbind();
    }

    destroyAll(contextLost = false){
        const gl = this.#gl;

        for (const i in this.#geometryVaoHash){

            if (contextLost) {
                // TOOD
            }
            
            this.#geometryVaoHash[i] = null;
        }
    }

    destroy(){
        this.renderer = null;
        this.#gl = null;
        this.#activeVao = null;
        this.#activeGeometry = null;
    }
}