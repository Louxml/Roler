import { GL_FORMATS, GL_TARGETS, GL_TYPES } from "./const.js";


export class GLTexture {

    /** 纹理绑定目标, 例如：gl.TEXTURE_2D */
    target;

    /** 
     * 纹理对象
     * @type {WebGLTexture}
     *
    */
    texture;

    /**
     * 纹理的宽度
     * @type {Number}
     */
    width;

    /**
     * 纹理的高度
     * @type {Number}
     */
    height;

    /**
     * 是否开启mipmap
     * @type {Boolean}
     */
    mipmap;

    /**
     * 纹理类型,定义rgba通道的划分
     * @type {Number}
     */
    type;
    
    /**
     * 纹理内部格式
     * @type {Number}
     */
    internalFormat;

    /**
     * 纹理采样类型
     * @type {Number}
     */
    samplerType;

    /**
     * 纹理格式
     * @type {Number}
     */
    format;


    constructor(texture) {
        this.target = GL_TARGETS.TEXTURE_2D;
        this.texture = texture;
        this.width = -1;
        this.height = -1;
        this.type = GL_TYPES.UNSIGNED_BYTE;
        this.internalFormat = GL_FORMATS.RGBA;
        this.format = GL_FORMATS.RGBA;
        this.mipmap = false;
        this.samplerType = 0;
    }
}