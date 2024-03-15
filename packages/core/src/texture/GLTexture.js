import { FORMATS, TYPES, WRAP_MODES } from "../../../constants/src/index.js";


export class GLTexture{

    /**
     * WebGL Texture
     * @WebGLTexture
     * @public
     */
    texture;

    /**
     * texImage2D中使用的纹理宽度
     * @Number
     * @public
     */
    width;

    /**
     * texImage2D中使用的纹理高度
     * @Number
     * @public
     */
    height;

    /**
     * 是否生成mip级别纹理
     * 该值来源于baseTexture
     * @Boolean
     * @public
     */
    mipmap;

    /**
     * 边缘绘制是拉伸复制还是平铺
     * 该值来源于baseTexture
     * @number
     * @public
     */
    wrapMode;

    /**
     * 未知来源于BaseTexture ？
     * 数据格式，比如无符号字节型、无符号整型、无符号浮点型
     * @Number
     * @public
     */
    type;

    /**
     * GPU内存中存储的格式，颜色划分规则？
     * @public
     */
    internalFormat;

    samplerType;

    /**
     * 纹理更新变化ID
     * @public
     */
    updateID;

    /**
     * 纹理状态更新变化ID
     * 比如：mipmap、wrapMode等
     * @public
     */
    updateStyleID;

    constructor(texture){
        this.texture = texture;
        this.width = -1;
        this.height = -1;
        this.updateID = -1;
        this.updateStyleID = -1;
        this.mipmap =  false;
        this.wrapMode =  WRAP_MODES.CLAMP;
        // TODO
        this.type = TYPES.UNSIGNED_BYTE;
        this.internalFormat = FORMATS.RGBA;
        // this.samplerType = 0;
    }
}