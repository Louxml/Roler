

import { uid } from "../../../../utils/data/uid.js";
import { BindResource } from "../../gpu/shader/BindResource.js";
import { BufferUsage } from "./const.js";

const BufferOptions = {

    /**
     * 数据源，可以是类型数组或普通数组，普通数组将会被转换成Float32Array
     * @type {TypeArray|Array}
     */
    data: [],

    /**
     * 缓冲区大小，单位为字节
     */
    size: undefined,

    /**
     * 缓冲区类型，默认为
     * @type {Number}
     */
    usage: 0,

    /**
     * 缓冲区标签，用于调试
     * @type {String}
     */
    label: undefined,

    /**
     * 是否自动收缩到实际大小，默认为false
     * @type {Boolean}
     */
    shrinkToFit: false,
}

export class Buffer extends BindResource {

    /**
     * 缓冲区大小调整时触发，通知GPU丢弃旧缓冲区创建新缓冲区
     * @event change
     */

    /**
     * 缓冲区数据更新时触发，通知GPU更新缓冲区
     * @event update
     */

    /**
     * 缓冲区销毁时触发，通知GPU丢弃缓冲区
     * @event destroy
     */


    /**
     * buffer 唯一id标识
     * @type {Number}
     */
    #uid;

    /**
     * 缓冲区的描述
     */
    #descriptor;

    /**
     * 更新状态
     * @type {Number}
     */
    updateID = 0;


    /**
     * 数据源
     * @type {TypeArray|Array}
     */
    #data;

    /**
     * 是否自动收缩到实际大小
     * @type {Boolean}
     */
    shrinkToFit = false;

    /**
     * 是否被销毁
     */
    destroyed = false;

    /**
     * 缓冲区上传更新大小（单位字节）
     */
    _updateSize = 0;


    constructor(options){
        super('buffer');

        options = {...BufferOptions, ...options};
        let { data, size } = options;
        const { usage, label, shrinkToFit } = options;

        if (data instanceof Array){
            data = new Float32Array(data ?? []);
        }

        this.#data = data;

        this._updateSize = size = size ?? data?.byteLength ?? 0;

        this.#descriptor = {
            size,
            usage,
            label,
        }
        
        this.#uid = uid('buffer');

        this.shrinkToFit = shrinkToFit;
    }

    get uid(){
        return this.#uid;
    }

    get data(){
        return this.#data;
    }

    set data(value = []){
        if (value instanceof Array){
            value = new Float32Array(value);
        }
        this.setDataWithSize(value, value.length, true);
    }

    get descriptor(){
        return this.#descriptor;
    }

    get static(){
        return !!(this.#descriptor.usage & BufferUsage.STATIC);
    }

    set static(value){
        if (value){
            this.#descriptor.usage |= BufferUsage.STATIC_DRAW;
        } else {
            this.#descriptor.usage &= ~BufferUsage.STATIC_DRAW;
        }
    }

    /**
     * 设置缓冲区数据，是否立即更新GPU，默认false
     * @param {TypeArray} value 数据，类型数组 Float32Array
     * @param {Number} size 更新数据大小
     * @param {Boolean} update 是否立即更新GPU
     */
    setDataWithSize(value, size = 0, update = false){
        this.updateID++;

        this._updateSize = size * value.TYPES_PER_ELEMENT;

        const oldData = this.#data;
        this.#data = value;

        if (oldData.length !== value.length){
            if (this.shrinkToFit || value.byteLength >= oldData.byteLength){
                this.#descriptor.size = value.byteLength;
                this._resourceId = uid('resource');
                this.emit('change', this);

                return;
            }
        }

        if (update) this.emit('update', this);
    }

    /**
     * 更新缓冲区上传至GPU
     * @param {Number} sizeInBytes 局部更新大小（字节）
     */
    update(sizeInBytes){
        this._updateSize = sizeInBytes ?? this._updateSize ?? 0;

        this.updateID++;

        this.emit('update', this);
    }

    destroy(){
        if (this.destroyed) return;

        this.destroyed = true;

        this.emit('destroy', this);
        this.emit('change', this);

        this.#data = null;
        this.#descriptor = null;

        this.clear();
    }
}