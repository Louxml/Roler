

export class GLProgram{

    /**
     * WebGLProgram
     * @public
     */
    program;

    /**
     * uniform数据接口结构
     * @public
     */
    uniformData;

    // uniformGroups;

    /**
     * uniformGroup更新标记列表
     * @public
     */
    uniformUpdateGroups;

    // uniformBufferBindings;

    /**
     * 
     * @param {WebGLProgram} program webgl program
     * @param {Array} uniformData uniform数据
     */
    constructor(program, uniformData){
        this.program = program;
        this.uniformData = uniformData;

        this.uniformUpdateGroups = {};
        // this.uniformGroups = {};
        // this.uniformBufferBindings = {};
    }

    destroy(){
        this.uniformData = null;
        this.uniformUpdateGroups = null;

        // this.uniformGroups = null;
        // this.uniformBufferBindings = null;
        this.program = null;
    }
}