import { ExtensionType } from "../../../../extensions/index.js";
import { Geometry } from "../../shared/geometry/Geometry.js";
import { System } from "../../shared/system/System.js";


const GLTopologyMap = {
    'point-list':       0x0000,
    'line-list':        0x0001,
    'line-loop':        0x0002,
    'line-strip':       0x0003,
    'triangle-list':     0x0004,
    'triangle-strip':   0x0005,
    'triangle-fan':     0x0006,
}


export class GLGeometrySystem extends System {
    
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'geometry',
    }

    /**
     * 是否支持VAO
     * @Boolean
     * @public
     */
    hasVao;

    /**
     * 是否支持实例化绘制
     * @Boolean
     * @public
     */
    hasInstance;

    /**
     * WebGL上下文环境
     */
    #gl;

    /**
     * 当前绑定的几何体
     */
    #activeGeometry;

    /**
     * 当前绑定的VAO
     */
    #activeVao;

    /**
     * 几何体和VAO的映射关系，之前绑定过的VAO会缓存起来
     */
    #geometryVaoHash;

    constructor(renderer){
        super(renderer);

        this.#activeGeometry = null;
        this.#activeVao = null;

        this.#geometryVaoHash = Object.create(null);

        this.hasVao = true;
        this.hasInstance = true;
    }

    init(){
        console.log("GLGeometrySystem init");
    }

    contextChange(gl){
        this.#gl = gl;
        
        const webGLVersion = this.renderer.context.webGLVersion;
        if (webGLVersion !== 2){
            // webGL1 vao方法映射，统一WebGL2的API
            const vertexArrayObject = this.renderer.context.extensions.vertexArrayObject
            gl.createVertexArray = () => vertexArrayObject?.createVertexArrayOES();
            gl.bindVertexArray = (vao) => vertexArrayObject?.bindVertexArrayOES(vao);
            gl.deleteVertexArray = (vao) => vertexArrayObject?.deleteVertexArrayOES(vao);

            // webGL1 instance方法映射， 统一WebGL2的API
            const instanceArray = this.renderer.context.extensions.vertexAttribDivisorANGLE;
            gl.drawArraysInstanced = (...args) => instanceArray?.drawArraysInstancedANGLE(...args);
            gl.drawElementsInstanced = (...args) => instanceArray?.drawElementsInstancedANGLE(...args);
            gl.vertexAttribDivisor = (...args) => instanceArray?.vertexAttribDivisorANGLE(...args);
        }

        this.#activeGeometry = null;
        this.#activeVao = null;
    }

    bind(geometry, program){
        const gl = this.#gl;

        this.#activeGeometry = geometry;

        const vao = this.#getVao(geometry, program);

        if (this.#activeVao !== vao){
            this.#activeVao = vao;

            gl.bindVertexArray(vao);
        }

        this.updateBuffers();
    }

    /**
     * 获取VAO对象，如果之前已经创建过，则直接返回，否则创建新的VAO对象
     * @param {Geometry} geometry 
     * @param {GLProgram} program 
     * @returns 
     */
    #getVao(geometry, program){
        return this.#geometryVaoHash[geometry.uid]?.[program.key] || this.#createVao(geometry, program);
    }

    /**
     * 创建VAO对象，并缓存VAO，避免重复创建
     * @param {geometry} geometry 
     * @param {GLProgram} program 
     */
    #createVao(geometry, program){
        const gl = this.#gl;
        
        const bufferSystem = this.renderer.buffer;

        this.renderer.shader._getProgramData(program);

        // 检查Geometry和Program是否兼容，检查attributes是否匹配
        this.#checkCompatibility(geometry, program);

        const signature = this.getSignature(geometry, program);

        if (!this.#geometryVaoHash[geometry.uid]){
            this.#geometryVaoHash[geometry.uid] = Object.create(null);

            geometry.on('destroy', this.#onGeometryDestroy, this);
        }

        const vaoHash = this.#geometryVaoHash[geometry.uid];
        
        let vao = vaoHash[signature];

        if (vao) {
            // 这里使用双key缓存，program.key和signature，方便getVao获取Vao
            vaoHash[program.key] = vao;
            return vao;
        }

        // 将shader里attribute格式同步到 geometry里
        this.#updateAttributes(geometry, program._attributeData);

        const buffers = geometry.buffers;

        // 创建VAO
        vao = gl.createVertexArray();
    
        // 绑定当前vao
        gl.bindVertexArray(vao);

        // 绑定buffer，主要是创建WebGLBuffer对象
        for (const i in buffers){
            bufferSystem.bind(buffers[i]);
        }

        this.#activateVao(geometry, program);

        // 添加hash缓存
        vaoHash[program.key] = vaoHash[signature] = vao;

        // 解除绑定
        gl.bindVertexArray(null);

        return vao;
    }

    /**
     * 激活VAO，绑定buffer，设置attribute关联VAO
     * @param {Geometry} geometry 
     * @param {GLProgram} program 
     */
    #activateVao(geometry, program){
        const gl = this.#gl;
        const bufferSystem = this.renderer.buffer;

        const attributes = geometry.attributes;

        let lastBuffer = null;

        for (const i in attributes){
            const attribute = attributes[i];
            // 属性中的buffer，可能跟其他属性共享buffer，是同一个buffer
            const buffer = attribute.buffer;
            const attributeData = program._attributeData[i];

            if (!attributeData)continue;

            // 避免重复绑定buffer
            if (lastBuffer !== buffer){
                bufferSystem.bind(buffer);
                lastBuffer = buffer;
            }

            const location = attribute.location;

            // 启用属性
            gl.enableVertexAttribArray(location);
            
            if (attribute.format.substring(1, 4) === 'int'){
                gl.vertexAttribIPointer(
                    location,
                    attribute.size,
                    attribute.type,
                    attribute.stride,
                    attribute.offset
                );
            }else{
                gl.vertexAttribPointer(
                    location,
                    attribute.size,
                    attribute.type,
                    attribute.normalize,
                    attribute.stride,
                    attribute.offset
                );
            }

            // 实例化绘制
            if (attribute.instance){
                if (!this.hasInstance){
                    throw new Error('Shader not support instanced rendering');
                }
                
                const divisor = attribute.divisor ?? 1;

                gl.vertexAttribDivisor(location, divisor);
            }
        }
    }

    /**
     * 同步Shader中的属性格式至Geometry,如果Geometry中没有对应的属性，则抛出错误
     * @param {Geometry} geometry 
     * @param {AttributeData} shaderAttributes 
     */
    #updateAttributes(geometry, shaderAttributes){

        const { buffers, attributes } = geometry;

        for (const i in attributes){
            const attribute = attributes[i];
            const attributeData = shaderAttributes[i];

            if (attributeData){
                attribute.location ??= attributeData.location;
                attribute.format ??= attributeData.format;
                attribute.type ??= attributeData.type;
                attribute.size = attributeData.size;
                attribute.offset ??= attributeData.offset;
                attribute.instance ??= attributeData.instance;
                attribute.normalize = attributeData.normalize;
                // 每个属性占用的内存大小（字节）
                attribute.stride ??= attributeData.stride;
            }else{
                throw new Error(`Geometry attribute "${i}" not found in Shader`);
            }
        }

        const tempStride = {};
        const tempStart = {};

        for (const i in buffers){
            const buffer = buffers[i];

            tempStride[buffer.uid] = 0;
            tempStart[buffer.uid] = 0;
        }

        for (const i in attributes){
            const attribute = attributes[i];

            // 计算每个buffer的每条数据的长度（字节）
            tempStride[attribute.buffer.uid] += attribute.stride;
        }
        // console.log(tempStride)

        // 设置attribute的start和stride
        for (const i in attributes){
            const attribute = attributes[i];

            attribute.stride = tempStride[attribute.buffer.uid];
            // 在每条数据长度中的的偏移或者起始点
            attribute.start = tempStart[attribute.buffer.uid];

            tempStart[attribute.buffer.uid] += attribute.stride;
        }
    }

    /**
     * 检查Geometry和Program是否兼容
     * @param {Geometry} geometry Geometry
     * @param {GLProgram} program Program
     * @returns
     */
    #checkCompatibility(geometry, program){
        const geometryAttributes = geometry.attributes;
        const shaderAttributes = program._attributeData;

        // 几何属性必须包含shader属性
        for (const name in shaderAttributes){
            if (!geometryAttributes[name]){
                throw new Error(`Shader attribute "${name}" not found in Geometry`);
            }
        }
    }

    /**
     * TODO
     * 生成Geometry和Program的唯一签名
     * @param {*} geometry 
     * @param {*} program 
     */
    getSignature(geometry, program){
        const attributes = geometry.attributes;
        const shaderAttributes = program._attributeData;

        const strings = [`g:${geometry.uid}`];

        for (const name in attributes){
            if (shaderAttributes[name]){
                strings.push(`${name}:${shaderAttributes[name].location}`);
            }
        }

        return strings.join('-');
    }

    /**
     * 更新当前绑定的Geometry的Buffer
     */
    updateBuffers(){
        const gl = this.#gl;
        const geometry = this.#activeGeometry;
        
        const bufferSystem = this.renderer.buffer;

        for (let i = 0; i < geometry.buffers.length; i++){
            const buffer = geometry.buffers[i];

            bufferSystem.updateBuffer(buffer);
        }
    }


    draw(topology, size, start = 0, instanceCount){
        const gl = this.#gl;
        const geometry = this.#activeGeometry;
        
        topology = GLTopologyMap[geometry.topology ?? topology];
        instanceCount ??= geometry.instanceCount;

        if (geometry.indexBuffer){
            size ??= geometry.indexBuffer.data.length;

            const byteSize =  geometry.indexBuffer.data.BYTES_PER_ELEMENT
            const glType = byteSize === 2 ? gl.UNSIGNED_SHORT : gl.UNSIGNED_INT;
            
            if (instanceCount > 1){
                gl.drawElementsInstanced(topology, size, glType, start * byteSize, instanceCount);
            }else{
                console.log(topology, size, glType, start * byteSize);
                gl.drawElements(topology, size, glType, start * byteSize);
            }
        }else{
            size ??= geometry.getSize();

            if (instanceCount > 1){
                gl.drawArraysInstanced(topolog, start, size, instanceCount);
            }else {
                gl.drawArrays(topology, start, size);
            }
        }

        return this;
    }

    /**
     * 重置或解绑所有激活的VAO 和 Geometry
     */
    unbind(){
        this.#gl.bindVertexArray(null);
        this.#activeVao = null;
        this.#activeGeometry = null;
    }

    /**
     * 重置或解绑所有激活的VAO 和 Geometry
     */
    reset(){
        this.unbind();
    }

    /**
     * Geometry销毁时的回调，删除对应的VAO
     * @param {Geometry} geometry Geometry
     */
    #onGeometryDestroy(geometry){
        const vaoHash = this.#geometryVaoHash[geometry.uid];
        const gl = this.#gl;

        if (vaoHash){
            // TODO 这里pixijs是在contextlost的时候删除的
            for (const i in vaoHash){
                if (this.#activeVao === vaoHash[i]){
                    this.unbind();
                }

                gl.deleteVertexArray(vaoHash[i]);
            }

            this.#geometryVaoHash[geometry.uid] = null;
        }
    }

    destroyAll(contextLost = false){
        const gl = this.#gl;

        for (const i in this.#geometryVaoHash){

            if (contextLost) {
                // TOOD
            }
            
            this.#geometryVaoHash[i] = null;
        }
    }

    destroy(){
        this.renderer = null;
        this.#gl = null;
        this.#activeVao = null;
        this.#activeGeometry = null;
    }

    get gl(){
        return this.#gl;
    }
}