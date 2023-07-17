
import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";


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

    constructor(renderer){
        super();

        this.renderer = renderer;
    }

    init(){
        console.log(`Geometry System`);
    }

    contextChange(){

        this.disposeAll(true)
        
        const gl = this.gl = this.renderer.gl;
        const context = this.renderer.context;

        this.CONTEXT_UID = this.renderer.CONTEXT_UID;

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
        // shader = shader || this.renderer.shader.shader;
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