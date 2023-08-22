
import { Runner } from "../../../runner/src/index.js";
import { Buffer } from "../buffer/Buffer.js";
import { Attribute } from "./Attribute.js";

let UID = 0;

// 支持的数据类型
const map = {
    // Float64Array,
    Float32Array,
    Uint32Array,
    Int32Array,
    Uint16Array,
    // Int16Array,
    Uint8Array,
    // Int8Array
}

export class Geometry{

    /**
     * 唯一标识
     * @public
     */
    id;

    /**
     * 所有buffer列表
     * @Array
     * @public
     */
    buffers;

    /**
     * attribute对象列表
     * @Array
     * @public
     */
    attributes;

    /**
     * 索引buffer对象
     * @Buffer
     * @public
     */
    indexBuffer;

    /**
     * 销毁处理运行器
     * @Runner
     * @oublic
     */
    disposeRunner;

    /**
     * 实例化绘制
     * @Boolean
     * @public
     */
    instanced;

    constructor(buffers = [], attributes = []){
        this.buffers = buffers;
        this.attributes = attributes;
        this.indexBuffer = null;

        this.id = UID++;
        
        this.disposeRunner = new Runner("dispose");
    }

    /**
     * 添加属性数据
     * @param {String} id 属性名字
     * @param {Buffer | Float32Array | number[]} buffer 数据
     * @param {Number} size 单个元素的大小
     * @param {Boolean} normalized 是否归一化
     * @param {Number} type 枚举的数据类型
     * @param {Number} stride 每一组的长度
     * @param {Number} start 在每一组内的偏移
     * @param {Boolean} instance 是否实例化绘制
     * @returns this 链式调用
     */
    addAttribute(id, buffer, size = 0, normalized = false, type, stride = 0, start = 0, instance = false){
        if (!id || !buffer){
            throw new Error("ID and buffer cannot be empty");
        }

        if (!(buffer instanceof Buffer)){
            buffer = new Buffer(buffer);
        }

        const ids = id.split('|')
        if (ids.length > 1){
            for(let i in ids){
                this.addAttribute(ids[i], buffer, size, normalized, type);
            }      
            return this;
        }

        const bufferIndex = this.buffers.indexOf(buffer)
        if (bufferIndex === -1){
            this.buffers.push(buffer);
            bufferIndex = this.buffers.length - 1;
        }

        this.attributes[id] = new Attribute(bufferIndex, size, normalized, type, stride, start, instance);

        this.instanced ||= instance;

        return this
    }

    /**
     * 获取属性
     * @param {String} id 属性名字
     * @returns 属性对象
     */
    getAttribute(id){
        return this.attributes[id]
    }

    /**
     * 根据属性名字获取Buffer
     * @param {String} id 属性名字
     * @returns buffer对象
     */
    getBuffer(id){
        return this.buffers[this.attributes[id].buffer]
    }

    /**
     * 添加index buffer对象
     * @param {Buffer} buffer 对象
     * @returns 
     */
    addIndex(buffer){
        if (!(buffer instanceof Buffer)){
            buffer = new Buffer(buffer, true, true);
        }

        buffer.indexBuffer = buffer;
        if (!(this.buffers.includes(buffer))){
            this.buffers.push(buffer);
        }

        return this;
    }

    /**
     * 获取index buffer对象
     * @returns index Buffer对象
     */
    getIndex(){
        return this.indexBuffer;
    }

    /**
     * 结构优化，buffer融合，数据交叉读取
     */
    interleave(){

    }

    /**
     * 销毁处理
     * @public
     */
    dispose(){
        this.disposeRunner.emit(this, false);
    }

    /**
     * 销毁
     * @public
     */
    destroy(){
        this.dispose();

        this.disposeRunner.destroy();
        this.buffers = null;
        this.attributes = null;
        this.indexBuffer = null;
    }

    /**
     * 对象克隆
     */
    clone(){

    }

    // 几何形混合
    static merge(...geometries){
        
    }
}