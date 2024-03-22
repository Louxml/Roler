
// 混合模式
export const BLEND_MODES = {
    NONE: -1,
    NORMAL: 0,
    ADD: 1,
    MULTIPLY: 2,
    SCREEN: 3,
    OVERLAY: 4,
    DARKEN: 5,
    LIGHTEN: 6,
    COLOR_DODGE: 7,
    COLOR_BURN: 8,
    HARD_LIGHT: 9,
    SOFT_LIGHT: 10,
    DIFFERENCE: 11,
    EXCLUSION: 12,
    HUE: 13,
    SATURATION: 14,
    COLOR: 15,
    LUMINOSITY: 16,
    NORMAL_NPM: 17,
    ADD_NPM: 18,
    SCREEN_NPM: 19,

    SRC_OVER: 0,
    SRC_IN: 21,
    SRC_OUT: 22,
    SRC_ATOP: 23,
    DST_OVER: 24,
    DST_IN: 25,
    DST_OUT: 26,
    DST_ATOP: 27,
    ERASE: 26,
    SUBTRACT: 28,
    XOR: 29
}

// buffer类型
export const BUFFER_TYPE = {
    ELEMENT_ARRAY_BUFFER: 0x8893,

    ARRAY_BUFFER: 0x8892,

    UNIFORM_BUFFER: 0x8A11,
}

// 绘画模式（图元装配）
export const DRAW_MODES = {
    POINTS: 0,
    LINES: 1,
    LINE_LOOP: 2,
    LINE_STRIP: 3,
    TRIANGLES: 4,
    TRIANGLE_STRIP: 5,
    TRIANGLE_FAN: 6,
}

// Shader Precision 精度
export const PRECISION = {
    // 低精度
    LOW: "lowp",
    // 中等精度
    MEDIUM: "mediump",
    // 高精度
    HIGH: "highp"
}

// mipmap过滤模式
export const MIPMAP_MODES = {
    // 关闭
    OFF: 0,
    // 纹理宽高是2的指数幂开启
    POW2: 1,
    // 开启
    ON: 2,
    // 手动管理
    // ON_MANUAL
}

// 纹理边缘绘制模式
export const WRAP_MODES = {
    // 拉伸
    CLAMP: 0x812F,
    // 平铺
    REPEAT: 0x2901,
    // 镜像平铺
    MIRRORED_REPEAT: 0x8370,
}

// 缩放模式
export const SCALE_MODES = {
    // 最近
    NEAREST: 0,

    // 线性
    LINEAR: 1,
}


// 透明模式
export const ALPHA_MODE = {

    // 源不是预乘的，不预乘Alpha
    NPM: 0,

    // 默认选项，源不是预乘的，需要预乘Alpha
    UNPACK: 1,

    // 源是预乘的
    PMA: 2,
}

// 各种target类型
export const TARGETS = {
    // 二维纹理
    TEXTURE_2D: 0x0DE1,
}

// 像素数据格式
export const FORMATS  = {
    /**
     * rgba四个分量
     * @default 6408
     */
    RGBA: 0x1908,

    /**
     * rgb三个分量
     * @default 6407
     */
    RGB: 0x1907,

    /**
     * rg两个分量
     * @default 33319
     */
    RG: 0x8227,

    /**
     * r一个分量
     * @default 6403
     */
    RED: 0x1903,

    /**
     * RGBA整型四个分量
     * @default 36249
     */
    RGBA_INTEGER: 0x8d99,

    /**
     * RGB整型三个分量
     * @default 36248
     */
    RGB_INTEGER: 0x8d98,

    /**
     * RG整型两个分量
     * @default 33320
     */
    RG_INTEGER: 0x8228,

    /**
     * R整型一个分量
     * @default 36244
     */
    RED_INTEGER: 0x8d94,

    /**
     * 透明度一个分量
     * @default 6406
     */
    ALPHA: 0x1906,

    /**
     * 亮度一个分量
     * @default 6409
     */
    LUMINANCE: 0x1909,

    /**
     * 亮度和透明度两个分量
     * @default 6410
     */
    LUMINANCE_ALPHA: 0x190A,

    /**
     * 深度一个分量
     * @default 6402
     */
    DEPTH_COMPONENT: 0x1902,

    /**
     * 深度和模板两个分量
     * @default 34041
     */
    DEPTH_STENCIL: 0x84f9,
}

// 纹理存储数据类型
export const TYPES = {
    /**
     * 每个通道8位
     * 字节型（范围-128～127）
     * WebGL1
     * @default 5120
     */
    BYTE: 0x1400,
    /**
     * 每个通道8位
     * 无符号字节型（范围0～255）
     * WebGL1
     * @default 5121
     */
    UNSIGNED_BYTE: 0x1401,
    /**
     * 每个通道16位
     * 短整型（范围-32768～32767）
     * WebGL1
     * @default 5122
     */
    SHORT: 0x1402,
    /**
     * 每个通道16位
     * 无符号短整型（范围0～65535）
     * WebGL1
     * @default 5123
     */
    UNSIGNED_SHORT: 0x1403,
    /**
     * 每个通道32位
     * 整型（范围-2147483648~2147483647）
     * WebGL1
     * @default 5124
     */
    INT: 0x1404,
    /**
     * 每个通道32位
     * 无符号整型（范围0~4294967295）
     * WebGL1
     * @default 5124
     */
    UNSIGNED_INT: 0x1405,
    /**
     * 每个通道32位
     * 浮点型 指数8位，尾数23位，符号位1位
     * WebGL1
     * @default 5125
     */
    FLOAT: 0x1406,
    /**
     * r：4位，g：4位，b：4位，a：4位
     * 无符号短整型
     * WebGL1
     * @default 32819
     */
    UNSIGNED_SHORT_4_4_4_4: 0x8033,
    /**
     * r：5位，g：5位，b：5位，a：1位 
     * 无符号短整型
     * WebGL1
     * @default 32820
     */
    UNSIGNED_SHORT_5_5_5_1: 0x8034,
    /**
     * r：5位，g：6位，b：5位
     * 无符号短整型
     * WebGL1
     * @default 33635
     */
    UNSIGNED_SHORT_5_6_5:  0x8363,
    /**
     * a：2位，b：10位，g：10位，r：10位
     * 无符号整型
     * WebGL2
     * ```
     * 需要拓展OES_texture_float_linear 或 OES_texture_half_float_linear
     * ```
     * @default 33640
     */
    UNSIGNED_INT_2_10_10_10_REV: 0x8368,

    /**
     * rgb：24位，a：8位
     * 通常用于HDR
     * 无符号整型
     * 仅WebGL2
     * @default 34042
     */
    UNSIGNED_INT_24_8: 0x84fa,

    /**
     * b：10位，g：11位，r：11位
     * 通常用于HDR
     * 无符号整型
     * 仅WebGL2
     * @default 35899
     */
    UNSIGNED_INT_10F_11F_11F_REV:  0x8c3b,

    /**
     * a：5位，b：9位，g：9位，r：9位
     * 通常用于HDR
     * 无符号整型
     * 仅WebGL2
     * @default 35902
     */
    UNSIGNED_INT_5_9_9_9_REV: 0x8c3e,

    /**
     * rgb：24位，a：8位
     * 通常用于HDR
     * 仅WebGL2
     * @default 36269
     */
    FLOAT_32_UNSIGNED_INT_24_8_REV: 0x8dad,

    /**
     * 每个通道16位
     * 半精度浮点型
     * WebGL2
     * @default 36193
     */
    HALF_FLOAT: 0x8d61,
}

// 采样器类型
export const SAMPLER_TYPES = {
    /**
     * 浮点型
     * @default 0
     */
    FLOAT: 0,

    /**
     * 整型
     * @default 1
     */
    INT: 1,

    /**
     * 无符号整型
     * @default 2
     */
    UINT: 2
}