

import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";

import { GLBuffer } from "./GLBuffer.js";


export class BufferSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "buffer",
        priority: 60
    }

    /**
     * 渲染器对象
     * @public
     */
    renderer;

    /**
     * gl
     * @private
     */
    gl;

    /**
     * 上下文id
     * @private
     */
    CONTEXT_UID;

    /**
     * 管理buffer字典
     * @public
     */
    managedBuffers;

    constructor(renderer){
        super();

        this.renderer = renderer;
        this.managedBuffers = {};
    }

    init(){
        console.log(`Buffer System`);
    }

    contextChange(){
        this.disposeAll(true);

        this.gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID;
    }

    /**
     * 更新Buffer数据
     * @param {Buffer} buffer buffer对象
     * @returns 
     */
    update(buffer){
        const { CONTEXT_UID, gl } = this;
        const glBuffer = buffer.glBuffer[CONTEXT_UID] || this.createGLBuffer(buffer);

        if (glBuffer.updateID === buffer.updateID){
            return
        }
        glBuffer.updateID = buffer.updateID;

        // TODO数据长度减小时可优化
        gl.bindBuffer(buffer.type, glBuffer.buffer);
        const drawType = buffer.static ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW;
        glBuffer.byteLength = buffer.data.byteLength;
        gl.bufferData(buffer.type, buffer.data, drawType);
    }

    /**
     * 绑定Buffer对象
     * @param {Buffer} buffer Buffer对象
     */
    bind(buffer){
        const { CONTEXT_UID, gl } = this;
        
        const glBuffer = buffer.glBuffer[CONTEXT_UID] || this.createGLBuffer(buffer);

        gl.bindBuffer(buffer.type, glBuffer.buffer);
    }

    /**
     * 接触制定类型的buffer绑定
     * @param {BUFFER_TYPE} type BUFFER_TYPE类型
     */
    unbind(type){
        const { gl } = this;

        gl.bindBuffer(type, null);
    }

    // TODO
    bindBufferBase(){

    }

    // TODO
    bindBufferRange(){

    }

    /**
     * 删除处理旧环境的buffer
     * @param {Buffer} buffer buffer对象
     * @param {Boolean} contextLost 上下文环境是否已丢失
     * @returns 
     */
    dispose(buffer, contextLost){
        if (!this.managedBuffers[buffer.id]){
            return;
        }
        delete this.managedBuffers[buffer.id];
        
        const { CONTEXT_UID, gl } = this;
        const glBuffer = buffer.glBuffer[CONTEXT_UID];

        buffer.disposeRunner.remove(this);

        if (!glBuffer){
            return;
        }

        if (!contextLost){
            gl.deleteBuffer(glBuffer.buffer);
        }

        delete buffer.glBuffer[this.CONTEXT_UID];
    }

    /**
     * 删除处理旧环境的所有管理的buffer
     * @param {Boolean} contextLost 上下文环境是否丢失
     */
    disposeAll(contextLost){
        for (const k in this.managedBuffers){
            this.dispose(this.managedBuffers[k], contextLost);
        }
    }

    destroy(){
        this.renderer = null;
    }


    /**
     * 创建GLBuffer对象
     * @param {Buffer} buffer buffer对象
     * @returns GLBuffer 对象
     */
    createGLBuffer(buffer){
        const { CONTEXT_UID, gl } = this;

        buffer.glBuffer[CONTEXT_UID] = new GLBuffer(gl.createBuffer());

        this.managedBuffers[buffer.id] = buffer;

        buffer.disposeRunner.add(this);

        return buffer.glBuffer[CONTEXT_UID]
    }

}

Extension.add(BufferSystem);