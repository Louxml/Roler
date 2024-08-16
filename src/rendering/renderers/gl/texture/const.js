
//有点像rgba通道的划分
export const GL_TYPES = {
    //
    BYTE: 0x1400,
    // RGBA每个通道8位
    UNSIGNED_BYTE: 0x1401,
    //
    SHORT: 0x1402,
    // 
    UNSIGNED_SHORT: 0x1403,
    //
    INT: 0x1404,
    //
    UNSIGNED_INT: 0x1405,
    //
    FLOAT: 0x1406,
    // r：4位，g：4位，b：4位，a：4位 
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    // r：5位，g：5位，b：5位，a：1位 
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    // r：5位，g：6位，b：5位
    UNSIGNED_SHORT_5_6_5:  0x8363,
    //
    HALF_FLOAT: 0x8D61,
}

// 像素格式
export const GL_FORMATS = {
    RGBA: 0x1908,
    RGB: 0x1907,
    RG: 0x8227,
    RED: 0x1903,
    RGBA_INTEGER: 0x8D99,
    RGB_INTEGER: 0x8D98,
    RG_INTEGER: 0x8228,
    RED_INTEGER: 0x8D94,
    ALPHA: 0x1906,
    LUMINANCE: 0x1909,
    LUMINANCE_ALPHA: 0x190A,
    DEPTH_COMPONENT: 0x1902,
    DEPTH_STENCIL: 0x84F9,
}

// 纹理绑定目标
export const GL_TARGETS = {
    TEXTURE_2D: 0x0DE1,
    TEXTURE_CUBE_MAP: 0x8513,
    TEXTURE_2D_ARRAY: 0x8C1A,
    TEXTURE_CUBE_MAP_POSITIVE_X: 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_X: 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y: 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y: 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z: 0x8519,
    TEXTURE_CUBE_MAP_NEGATIVE_Z: 0x851A,
}


/**
 * 清除类型
 */
export const CLEAR = {
    NONE:       0,
    DEPTH:      0x100,
    STENCIL:    0x400,
    COLOR:      0x4000,

    COLOR_DEPTH:    0x4000 | 0x100,
    COLOR_STENCIL:  0x4000 | 0x400,
    DEPTH_STENCIL:  0x400 | 0x100,
    ALL:            0x4000 | 0x400 | 0x100,
}

// 环绕模式
export const WARP_MODES = {
    'clamp-to-edge': 0x812F,
    repeat: 0x2901,
    'mirror-repeat': 0x8370,
}

// 缩放模式
export const SCALE_MODES = {
    // 线性
    linear: 0x2601,
    // 最近采样    
    nearest: 0x2600,
}

// mipmap缩放模式
export const MIPMAP_SCALE_MODES = {
    linear: {
        linear: 0x2703,
        nearest: 0x2702,
    },
    nearest: {
        linear: 0x2701,
        nearest: 0x2700,
    }
}

// 比较模式
export const COMPARE_MODES = {
    /** 永不通过 */
    never: 0x0200,
    /** 小于存储值通过 */
    less: 0x0201,
    /** 等于存储值通过 */
    equal: 0x0202,
    /** 小于等于存储值通过 */
    'less-equal': 0x0203,
    /** 大于存储值通过 */
    greater: 0x0204,
    /** 不等于存储值通过 */
    'not-equal': 0x0205,
    /** 大于等于存储值通过 */
    'greater-equal': 0x0206,
    /** 总是通过 */
    always: 0x0207,
}