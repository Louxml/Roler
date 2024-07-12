

import { ExtensionType } from "../../../../extensions/index.js";
import { BufferUsage } from "../../shared/buffer/const.js";
import { System } from "../../shared/system/System.js";
import { GLBuffer } from "./GLBuffer.js";
import { BUFFER_TYPE } from "./const.js";


export class GLBufferSystem extends System {

    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'buffer'
    }

    /**
     * webgl上下文环境
     * @type {WebGLRenderingContext}
     */
    #gl;

    #glBuffers = Object.create(null);

    #boundBufferBases = Object.create(null);
    

    init(){
        console.log('GLBufferSystem init');
    }

    contextChange(gl){
        this.#gl = gl;

        this.#glBuffers = Object.create(null);
    }

    /**
     * 绑定buffer，第一次绑定时创建glBuffer 和 （WebGLBuffer）
     * @param {Buffer} buffer 要绑定的buffer
     * @public
     */
    bind(buffer){
        const gl = this.#gl;

        const glBuffer = this.getGLBuffer(buffer);
        
        gl.bindBuffer(glBuffer.type, glBuffer.buffer);
    }

    /**
     * 缓冲区绑定到指定的索引上，UNIFROM_BUFFER类型
     * @param {Buffer} buffer 要绑定的buffer
     * @param {Number} index 指定的索引，默认为0
     * @public
     */
    bindBufferBase(buffer, index = 0){
        const gl = this.#gl;

        if (this.#boundBufferBases[index] !== buffer) {
            const glBuffer = this.getGLBuffer(buffer);

            this.#boundBufferBases[index] = buffer;

            gl.bindBufferBase(gl.UNIFORM_BUFFER, index, glBuffer.buffer);
        }
    }

    /**
     * 
     * @param {Buffer} buffer 要绑定的buffer
     * @param {Number} index 指定的索引，默认为0
     * @param {Number} offset 偏移量，默认为0，1=256， 2=512等
     * @param {Number} size 大小，默认为256
     * @public
     */
    bindBufferRange(buffer, index = 0, offset = 0, size = 256){
        const gl = this.#gl;

        const glBuffer = this.getGLBuffer(buffer);

        gl.bindBufferRange(gl.UNIFORM_BUFFER, index, glBuffer.buffer, offset * size, size);
    }

    /**
     * 更新buffer数据上传至GPU
     * @param {Buffer} buffer 要更新的buffer
     * @public
     * @returns GLBuffer
     */
    updateBuffer(buffer){
        const gl = this.#gl;
       
        const glBuffer = this.getGLBuffer(buffer);

        if (buffer.updateID === glBuffer.updateID) {
            return glBuffer;
        }

        glBuffer.updateID = buffer.updateID;

        gl.bindBuffer(glBuffer.type, glBuffer.buffer);

        const data = buffer.data;

        // 更新数据长度小于buffer长度时，使用bufferSubData局部更新
        if (data.byteLength <= glBuffer.byteLength){

            gl.bufferSubData(glBuffer.type, 0, data, 0, buffer._updateSize / data.BYTES_PER_ELEMENT);

        }else{
            const drawType = buffer.static ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;

            glBuffer.byteLength = data.byteLength;

            gl.bufferData(glBuffer.type, data, drawType);
        }

        return glBuffer;
        
    }

    /**
     * 获取GLBuffer对象，第一次获取时创建GLBuffer对象
     * @param {Buffer} buffer buffer
     * @public
     * @returns GLBuffer
     */
    getGLBuffer(buffer){
        return this.#glBuffers[buffer.uid] || this.#createGLBuffer(buffer);
    }

    /**
     * 创建GLBuffer对象和（WebGLBuffer）
     * @param {Buffer} buffer buffer
     * @returns GLBuffer
     */
    #createGLBuffer(buffer){
        const gl = this.#gl;

        let type = BUFFER_TYPE.ARRAY_BUFFER;
        if (buffer.descriptor.usage & BufferUsage.INDEX) {
            type = BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
        }else if (buffer.descriptor.usage & BufferUsage.UNIFORM){
            type = BUFFER_TYPE.UNIFORM_BUFFER;
        }

        const glBuffer = new GLBuffer(gl.createBuffer(), type);
        
        this.#glBuffers[buffer.uid] = glBuffer;

        // 这里是监听buffer销毁事件，销毁时删除对应的WebGLBuffer，buffer销毁时，会自动清除所有监听
        buffer.on('destroy', this.#onDestroyBuffer, this);

        return glBuffer;
    }

    /**
     * buffer销毁
     * @param {Buffer} buffer 要销毁的buffer
     * @param {Boolean} contextLost 是否上下文丢失导致的，true则不删除buffer，false则在gpu中删除buffer
     */
    #onDestroyBuffer(buffer, contextLost = false){
        const glBuffer = this.#glBuffers[buffer.uid];

        if (!contextLost){
            this.#gl.deleteBuffer(glBuffer.buffer);
        }
        
        this.#glBuffers[buffer.uid] = null;
    }

    /**
     * 销毁所有管理的buffer
     */
    destroyAll(){
        for (const id in this.#glBuffers){
            this.#gl.deleteBuffer(this.#glBuffers[id].buffer);
        }

        this.#glBuffers = Object.create(null);
    }


    destroy(){
        this.renderer = null;
        this.#gl = null;
        this.#glBuffers = null;
        this.#boundBufferBases = null;
    }

    get gl(){
        return this.#gl;
    }
}