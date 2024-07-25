

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