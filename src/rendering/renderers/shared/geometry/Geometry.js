
import { EventEmitter } from '../../../../eventemitter/EventEmtter.js';
import { uid } from '../../../../utils/data/uid.js';
import { Attribute } from './Attribute.js';
import { Buffer } from '../buffer/Buffer.js'
import { BufferUsage } from '../buffer/const.js';


function ensureIsBuffer(buffer, index){

    if (!(buffer instanceof Buffer)) {
        
        let usage = index ? BufferUsage.INDEX : BufferUsage.VERTEX;
        if (buffer instanceof Array) {

            buffer = index ? new Uint32Array(buffer) : new Float32Array(buffer);

            usage |= BufferUsage.COPY_DST;
        }
        buffer = new Buffer({
            data: buffer,
            label: index ? 'index-mesh-buffer' : 'vertex-mesh-buffer',
            usage
        })
    }


    return buffer
}


const GeometryOptions = {
    /**
     * 标签，用于调试
     * @type {string}
     */
    label: undefined,

    /**
     * 几何图形属性数据
     * @type {key: String, value: Buffer | TypeArray | Array}
     */
    attributes: Object.create(null),

    /**
     * 索引数据
     * @type {Buffer | TypeArray | Array}
     */
    indexBuffer: undefined,

    /**
     * 几何图形拓扑结构
     * @type {String | Topology}
     * @values 'point-list' | 'line-list' | 'line-strip' | 'triangle-list' | 'triange-strip'
     */
    topology: 'triangle-list',

    /**
     * 实例化绘制的数量
     * @type {Number}
     */
    instanceCount: 1,
}


export class Geometry extends EventEmitter {

    /**
     * 数据更新时触发
     * @event update
     */

    /**
     * 销毁时触发
     * @event destroy
     */

    
    /**
     * 几何图形拓扑结构
     * @type {String | Topology}
     * @values 'point-list' | 'line-list' | 'line-strip' | 'triangle-list' | 'triange-strip'
     */
    topology;

    #uid;

    #attributes;

    #buffers;

    #indexBuffer;

    /**
     * 实例化绘制的数量
     * @type {Number}
     */
    instanceCount = 1;

    /**
     * 是否需要更新
     */
    #update = true;


    constructor(options){
        super();

        options = {...GeometryOptions, ...options}

        const { attributes, indexBuffer, topology } = options;

        this.#uid = uid('geometry');

        this.#attributes = attributes;
        this.#buffers = [];

        this.instanceCount = options.instanceCount;

        for (const i in attributes) {
            const attribute = attributes[i] = new Attribute(attributes[i]);
            const bufferIndex = this.#buffers.indexOf(attribute.buffer);

            if (bufferIndex === -1) {
                this.#buffers.push(attribute.buffer);

                attribute.buffer.on('update', this.onBufferUpdate, this);
                attribute.buffer.on('change', this.onBufferUpdate, this);
            }
        }

        if (indexBuffer){
            this.#indexBuffer = ensureIsBuffer(indexBuffer, true);
            this.#buffers.push(this.#indexBuffer);
        }

        this.topology = topology;
    }

    /**
     * 获取指定属性Attribute对象
     * @param {String} name 属性名
     * @returns Attribute
     */
    getAttribute(name){
        return this.#attributes[name];
    }
    
    /**
     * 获取index Buffer对象
     * @returns Buffer
     */
    getIndex(){
        return this.#indexBuffer;
    }

    /**
     * 获取指定属性Buffer对象
     * @param {String} name 属性名
     * @returns Buffer
     */
    getBuffer(name){
        return this.#attributes[name]?.buffer;
    }

    /**
     * 获取几何图形顶点数量
     * @returns 
     */
    getSize(){
        for (const i in this.#attributes) {
            const attribute = this.#attributes[i];
            const buffer = attribute.buffer;

            if (buffer.descriptor.usage & BufferUsage.VERTEX) {
                return buffer.data.length / ((attribute.stride / buffer.data.TYPES_PER_ELEMENT) || attribute.size);
            }
        }

        return 0;
    }

    onBufferUpdate(buffer){
        this.#update = true;
        this.emit('update', this);
    }

    destroy(destroyBuffers = false){
        this.emit('destroy', this);

        this.clear();

        if (destroyBuffers) {
            for (const i in this.#buffers) {
                this.#buffers[i].destroy();
            }
        }

        this.#buffers = null;
        this.#attributes = null;
        this.#indexBuffer = null;
    }

    get uid(){
        return this.#uid;
    }

    get update(){
        return this.#update;
    }

    get attributes(){
        return this.#attributes;
    }

    get buffers(){
        return this.#buffers;
    }

    get indexBuffer(){
        return this.#indexBuffer;
    }
}