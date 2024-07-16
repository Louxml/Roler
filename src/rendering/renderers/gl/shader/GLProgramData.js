

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

    /**
     * 当前使用的uniformGroup.uid对应的updateId，用来记录更新状态
     */
    uniformGroupUpdateIds;

    /**
     * uniformBlock的绑定位置
     * key: uniformblock 在program的索引
     * value: uniformBlock的绑定位置，比如BufferResource中buffer在环境中绑定的位置
     */
    uniformBlockBindings;

    constructor(program, uniformData){
        this.program = program;
        this.uniformData = uniformData;

        this.uniformGroupUpdateIds = {};
        this.uniformBlockBindings = {};
    }


    destroy(){
        this.uniformData = null;
        this.program = null;

        this.uniformGroupUpdateIds = null;
        this.uniformBlockBindings = null;
    }
}