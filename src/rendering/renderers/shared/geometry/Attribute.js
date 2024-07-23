
import { Buffer } from "../buffer/Buffer.js";
import { BufferUsage } from "../buffer/const.js";

export class Attribute {


    /**
     * buffer对象
     * @type {WebGLBuffer}
     */
    buffer;

    /**
     * 属性格式
     * @type {String}
     */
    format;

    /**
     * 属性在shader中的位置
     * @type {Number}
     */
    location;

    /**
     * 每一个属性的大小，步长值(单位字节)
     */
    stride;

    /**
     * 属性在buffer中的偏移量
     */
    offset;

    /**
     * 是否为实例化缓冲区，默认false
     */
    instance;

    /**
     * 单个顶点的数据个数
     */
    size;

    /**
     * 属性类型
     */
    type;

    /**
     * 是否归一化
     */
    normalize;

    /**
     * 开始绘制几何图形的起始顶点，未指定默认第一个顶点
     */
    start;

    /**
     * 实例化绘制因素，WebGPU环境下设置会触发警告
     */
    divisor;

    constructor(buffer){
        if (buffer instanceof Attribute){
            return buffer;
        }

        if (!(buffer instanceof Buffer)){
            
            let usage = BufferUsage.VERTEX;

            if (buffer instanceof Array){
                buffer = new Float32Array(buffer);
                usage |= BufferUsage.COPY_DST;
            }

            buffer = new Buffer({
                data: buffer,
                label: 'vertex-mash-buffer',
                usage,
            });
        }

        this.buffer = buffer;

        this.size = 1;

        this.normalize = false;
    }
}