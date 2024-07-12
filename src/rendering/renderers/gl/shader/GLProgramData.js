

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

    uniformGroupUpdateIds;

    constructor(program, uniformData){
        this.program = program;
        this.uniformData = uniformData;

        this.uniformGroupUpdateIds = {};
    }


    destroy(){
        this.uniformData = null;
        this.program = null;

        this.uniformGroupUpdateIds = null;
    }
}