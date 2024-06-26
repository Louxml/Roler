
import { BUFFER_TYPE } from "./const.js";

export class GLBuffer {

    /**
     * WebGLBuffer 对象
     * @type {WebGLBuffer}
     */
    buffer;

    /**
     * 当前更新ID
     * @type {number}
     */
    updateID;

    /**
     * 字节大小
     * @type {number}
     */
    byteLength;

    /**
     * 缓冲类型, BUFFER_TYPE类型
     * @type {number}
     */
    type;

    constructor(buffer = null, type = BUFFER_TYPE.ARRAY_BUFFER){
        this.buffer = buffer;
        this.updateID = -1;
        this.byteLength = -1;
        this.type = type;
    }
}