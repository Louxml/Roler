
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