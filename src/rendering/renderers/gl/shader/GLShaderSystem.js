import { ExtensionType } from "../../../../extensions/index.js";
import { System } from "../../shared/system/System.js";
import { GLProgram } from "./GLProgram.js";
import { generateProgram } from "./utils/generateProgram.js";


export class GLShaderSystem extends System {

    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'shader'
    }

    #activeProgram;

    #gl;

    #maxBindings

    #programDataHash;


    init(){
        console.log('GLShaderSystem init');
    }

    contextChange(gl){
        this.#gl = gl;

        this.#maxBindings = gl.MAX_UNIFORM_BUFFER_BINDINGS ? gl.getParameter(gl.MAX_UNIFORM_BUFFER_BINDINGS) : 0;

        // console.log(this.#maxBindings);

        this.#programDataHash = Object.create(null);

        this.#activeProgram = null;
    }


    bind(shader, skipSync){
        this.#setProgram(shader.glProgram);

        const key = shader.glProgram.key;

        console.log(key)

        // TODO 
    }

    /**
     * 设置当前激活的GLProgram，并使用WebGLProgram
     * @param {GLProgram} program 
     * @returns 
     */
    #setProgram(program){
        if (this.#activeProgram === program) return;

        this.#activeProgram = program;

        const programData = this.#getProgramData(program);

        this.#gl.useProgram(programData.program);
    }
    /**
     * 查找缓存中的GLProgramData对象, 如果没有则创建
     * @param {GLProgram} program 
     * @returns 
     */
    #getProgramData(program){
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


    destroy(){
        //TODO
    }
} 