
/**
 * 这个类主要规定的Attribute的属性和buffer的位置
 */
export class Attribute{

    /**
     * buffer位置
     * @Number
     * @public
     */
    buffer;

    /**
     * 长度
     * @Number
     * @public
     */
    size;

    /**
     * 是否归一化
     * @Boolean
     * @public
     */
    normalized;

    /**
     * 数据类型
     * @Type
     * @public
     */
    type;

    /**
     * 每一组的长度
     * @Number
     * @public
     */
    stride;

    /**
     * 在每一组内的偏移
     * @Number
     * @public
     */
    start;

    /**
     * 是否水实例化绘制
     * @Boolean
     * @public
     */
    instance;

    /**
     * 
     * @param {Number} buffer 在Geometry中的Index
     * @param {Number} size 每个的长度
     * @param {Boolean} normalized 是否归一化
     * @param {Type} type 数据类型
     * @param {Number} stride 每一组的长度
     * @param {Number} start 在每一组的偏移
     * @param {Boolean} instance 是否实例化绘制
     */
    constructor(buffer, size, normalized, type, stride, start, instance){
        this.buffer = buffer;
        this.size = size;
        this.normalized = normalized;
        this.type = type;
        this.stride = stride;
        this.start = start;
        this.instance = instance;
    }
}