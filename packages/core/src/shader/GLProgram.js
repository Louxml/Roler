

export class GLProgram{

    program;

    uniformData;

    uniformGroups;

    uniformUpdateGroups;

    uniformBufferBindings;

    /**
     * 
     * @param {WebGLProgram} program webgl program
     * @param {Array} uniformData uniform数据
     */
    constructor(program, uniformData){
        this.program = program;
        this.uniformData = uniformData;

        this.uniformGroups = {};
        this.uniformUpdateGroups = {};
        this.uniformBufferBindings = {};
    }

    destroy(){
        this.uniformData = null;
        this.uniformGroups = null;
        this.uniformUpdateGroups = null;
        this.uniformBufferBindings = null;
        this.program = null;
    }
}