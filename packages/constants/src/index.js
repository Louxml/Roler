
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

// 纹理环绕模式
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
    RGBA: 0x1908,

    RGB: 0x1907,
}