
import { System } from "../index.js";
import { Extension, ExtensionType } from "../../../extensions/src/index.js";

import { Program } from "../index.js";



export class GeometrySystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "geometry",
        priority: 40
    }

    /**
     * 渲染器对象
     * @private
     */
    renderer;

    /**
     * gl
     */
    gl;

    /**
     * 上下文uid
     */
    CONTEXT_UID;

    /**
     * 管理的Geometry对象列表
     */
    managedGeometries = {};

    /**
     * 无符号32位类型索引是否可用
     */
    isUint32ElementIndex;

    /**
     * 当前激活几何体
     * @private
     */
    #activeGeometry;

    constructor(renderer){
        super();

        this.#activeGeometry = null;

        this.renderer = renderer;
    }

    init(){
        console.log(`Geometry System`);
    }

    contextChange(){

        this.disposeAll(true)
        
        const gl = this.gl = this.renderer.gl;
        this.CONTEXT_UID = this.renderer.CONTEXT_UID;

        const context = this.renderer.context;

        if (context.webGLVersion !== 2){

            // vertexArrayObject 拓展
            const vertexArrayObject = context.extensions.vertexArrayObject;
            gl.createVertexArray = vertexArrayObject ? vertexArrayObject.createVertexArrayOES : () => null;
            gl.bindVertexArray = vertexArrayObject ? vertexArrayObject.bindVertexArrayOES : () => null;
            gl.deleteVertexArray = vertexArrayObject ? vertexArrayObject.deleteVertexArrayOES : () => null;

            const instanceArray = context.extensions.instanceArray;
            gl.vertexAttribDivisor = instanceArray ? instanceArray.vertexAttribDivisorANGLE : () => null;
            gl.drawElementsInstanced = instanceArray ? instanceArray.drawElementsInstancedANGLE : () => null;
            gl.drawArraysInstanced = instanceArray ? instanceArray.drawArraysInstancedANGLE : () => null;
        }

        this.isUint32ElementIndex = context.webGLVersion === 2 || !!context.extensions.unit32ElementIndex;
    }

    bind(geometry, shader){
        shader = shader || this.renderer.shader.shader;

        this.#activeGeometry = geometry;

        this.activateVao(geometry, shader.program);

        this.updateBuffers()
    }

    /**
     * TODO 可优化 VAO、Instance
     * 激活Geometry对象的attribute属性设置
     * @param {Geometry} geometry Geometry对象
     * @param {Program} program Program对象
     */
    activateVao(geometry, program){
        const {gl, CONTEXT_UID} = this;

        const bufferSystem = this.renderer.buffer;

        const buffers = geometry.buffers;
        const attributes = geometry.attributes;

        for (const id in attributes){
            const attribute = attributes[id]
            const buffer = buffers[attribute.buffer]

            if (program.attributeData[id]){
                // TODO 可优化如果同上一个是同一个buffer，不需要多次绑定
                bufferSystem.bind(buffer);

                const location = program.attributeData[id].location;

                gl.enableVertexAttribArray(location);

                gl.vertexAttribPointer(
                    location,
                    attribute.size,
                    attribute.type || gl.FLOAT,
                    attribute.normalized,
                    attribute.stride,
                    attribute.start
                );
            }
        }
    }
    
    /**
     * 更新当前活动Geometry对象的Buffer
     * @public
     */
    updateBuffers(){
        const geometry = this.#activeGeometry;
        const bufferSystem = this.renderer.buffer;

        for (let i = 0; i < geometry.buffers.length; i++){
            const buffer = geometry.buffers[i];
            
            bufferSystem.update(buffer);
        }
    }

    draw(type, size = 0, start = 0){
        const gl = this.gl;
        const geometry = this.#activeGeometry;

        size = size || geometry.getSize();

        gl.drawArrays(type, start, size);
    }

    unbind(){

    }

    dispose(geometry, contextLost){
        if (!this.managedGeometries[geometry.id]){
            return;
        }

        delete this.managedGeometries[geometry.id];

        const gl = this.gl;
        const buffers = geometry.buffers;
        const bufferSystem = this.renderer?.buffer;

        geometry.disposeGeomerey.remove(this);

        // TODO 这里的buffer在bufferSystem中应该处理过上下文丢失的情况，
        // 如果不是丢失只是销毁是不是可以直接销毁，除非还有其他情况
        // TODO 这里是否需要refCount 引用计数功能？
        if (bufferSystem && !contextLost){
            for (let buffer of buffers){
                buffer.destroy()
            }
        }

        // TODO 处理VAO数据
    }

    disposeAll(contextLost){
        for (let id in this.managedGeometries){
            this.dispose(this.managedGeometries[id], contextLost);
        }
    }

    destroy(){

    }

}

Extension.add(GeometrySystem);