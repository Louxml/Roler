

import { ExtensionType } from "../../../../extensions/index.js";
import { Geometry } from "../../shared/geometry/Geometry.js";
import { Shader } from "../../shared/shader/Shader.js";
import { State } from "../../shared/state/State.js";
import { System } from "../../shared/system/System.js";


export class GLEncoderSystem extends System {
    
    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem,
        ],
        name: 'encoder'
    }

    contextChange(gl){
        console.log('GLEncoderSystem init')
    }

    /**
     * 绑定几何的顶点数据
     * @param {Geometry} geometry 几何对象
     * @param {Shader} shader shader对象
     */
    setGeometry(geometry, shader){
        this.renderer.geometry.bind(geometry, shader.glProgram);
    }

    finishRenderPass(){

    }

    /**
     * 
     * @param {Object} options 配置
     * @param {Geometry} options.geometry 几何对象
     * @param {Shader} options.shader shader对象
     * @param {State} options.state 渲染状态
     * @param {Boolean} options.skipSync 是否跳过同步
     * @param {String} options.topology 绘制拓扑
     * @param {Number} options.size 绘制大小
     * @param {Number} options.start 绘制起始位置
     * @param {Number} options.instanceCount 实例数量
     */
    draw(options){
        const renderer = this.renderer;
        const { geometry, shader, state, skipSync, topology, size, start, instanceCount } = options;

        // 绑定Shader，处理Uniform数据
        renderer.shader.bind(shader, skipSync);

        // 绑定几何，处理顶点数据,采用当前GLProgram
        renderer.geometry.bind(geometry, renderer.shader.activeProgram);

        // 设置渲染状态
        if (state){
            renderer.state.set(state);
        }

        renderer.geometry.draw(topology, size, start, instanceCount);
    }

    destroy(){

    }
}