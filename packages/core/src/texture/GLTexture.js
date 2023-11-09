import { WRAP_MODES } from "../../../constants/src/index.js";


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
     * 未知来源于BaseTexture
     * @Number
     * @public
     */
    type;

    
    internalFormat;

    samplerType;

    updateID;

    updateStyleID;

    constructor(texture){
        this.texture = texture;
        this.width = -1;
        this.height = -1;
        this.updateID = -1;
        // this.updateStyleID = -1;
        this.mipmap =  false;
        this.wrapMode =  WRAP_MODES.CLAMP;
        // this.type
        // this.internalFormat;
        // this.samplerType = 0;
    }
}