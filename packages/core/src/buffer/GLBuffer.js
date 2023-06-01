

export class GLBuffer{

    /**
     * WebGL Buffer
     * @WebGLBuffer
     * @public
     */
    buffer;

    /**
     * 更新标记
     * @Number
     * @public
     */
    updateID;

    /**
     * 字节长度
     * @Number
     * @public
     */
    byteLength;

    /**
     * 引用计数
     * @Number
     * @public
     */
    refCount;

    constructor(buffer = null){
        this.buffer = buffer;
        this.updateID = -1;
        this.byteLength = -1;
        this.refCount = 0;
    }
}