

export class GLProgramData{


    /**
     * WebGLProgram
     * @type {WebGLProgram}
     */
    program;

    /**
     * uniform数据及结构
     */
    uniformData;

    constructor(program, uniformData){
        this.program = program;
        this.uniformData = uniformData;
    }


    destroy(){
        this.uniformData = null;
        this.program = null;
    }
}