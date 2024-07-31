import { DOMAdapter } from "../../../../../environment/Adapter.js";


/** format string 对应 internalFormat */
export function mapFormatToGLInternalFormat(gl, extensions){

    let srgb = {};
    let bgra8unorm = gl.RGBA;

    if (!(gl instanceof DOMAdapter.get().getWebGLRendereringContext())){
        // webgl2
        srgb = {
            'rgba8unorm-srgb': gl.SRGB8_ALPHA8,
            'bgra8unorm-srgb': gl.SRGB8_ALPHA8,
        };

        bgra8unorm = gl.RGBA8;
    }else if (extensions.sRGB){
        console
        // webgl1
        srgb = {
            'rgba8unorm-srgb': extensions.sRGB.SRGB8_ALPHA8_EXT,
            'bgra8unorm-srgb': extensions.sRGB.SRGB8_ALPHA8_EXT,
        };
    }

    return {
        // 8bit format
        r8unorm: gl.R8,
        r8snorm: gl.R8_SNORM,
        r8uint: gl.R8UI,
        r8sint: gl.R8I,

        // 16bit format
        r16uint: gl.R16UI,
        r16sint: gl.R16I,
        r16float: gl.R16F,
        rg8unorm: gl.RG8,
        rg8snorm: gl.RG8_SNORM,
        rg8uint: gl.RG8UI,
        rg8sint: gl.RG8I,

        // 32bit format
        r32uint: gl.R32UI,
        r32sint: gl.R32I,
        r32float: gl.R32F,
        rg16uint: gl.RG16UI,
        rg16sint: gl.RG16I,
        rg16float: gl.RG16F,
        rgba8unorm: gl.RGBA,

        // srgb
        ...srgb,

        // packed 32bit format
        rgba8snorm: gl.RGBA8_SNORM,
        bgra8unorm,


        // 64bit format
        rg32uint: gl.RG32UI,
        rg32sint: gl.RG32I,
        rg32float: gl.RG32F,
        rgba16uint: gl.RGBA16UI,
        rgba16sint: gl.RGBA16I,
        rgba16float: gl.RGBA16F,

        // 128bit format
        rgba32uint: gl.RGBA32UI,
        rgba32sint: gl.RGBA32I,
        rgba32float: gl.RGBA32F,

        // depth/stencil format
        stencil8: gl.STENCIL_INDEX8,
        depth16unorm: gl.DEPTH_COMPONENT16,
        depth24plus: gl.DEPTH_COMPONENT24,
        'depth24plus-stencil8': gl.DEPTH24_STENCIL8,
        depth32float: gl.DEPTH_COMPONENT32F,
        'depth32float-stencil8': gl.DEPTH32F_STENCIL8
    }
}

/** format string 对应 type */
export function mapFormatToGLType(gl){
    return {
        // 8bit format
        r8unorm: gl.UNSIGNED_BYTE,
        r8snorm: gl.BYTE,
        r8uint: gl.UNSIGNED_BYTE,
        r8sint: gl.BYTE,

        // 16bit format
        r16uint: gl.UNSIGNED_SHORT,
        r16sint: gl.SHORT,
        r16float: gl.HALF_FLOAT,
        rg8unorm: gl.UNSIGNED_BYTE,
        rg8snorm: gl.BYTE,
        rg8uint: gl.UNSIGNED_BYTE,
        rg8sint: gl.BYTE,

        // 32bit format
        r32uint: gl.UNSIGNED_INT,
        r32sint: gl.INT,
        r32float: gl.FLOAT,
        rg16uint: gl.UNSIGNED_SHORT,
        rg16sint: gl.SHORT,
        rg16float: gl.HALF_FLOAT,
        rgba8unorm: gl.UNSIGNED_BYTE,
        'rgba8unorm-srgb': gl.UNSIGNED_BYTE,

        // packed 32bit format
        rgba8snorm: gl.BYTE,
        bgra8unorm: gl.UNSIGNED_BYTE,
        'bgra8unorm-srgb': gl.UNSIGNED_BYTE,
    }
}

export function mapFormatToGLFormat(gl){
    return {
        // 8bit format
        r8unorm: gl.RED,
        r8snorm: gl.RED,
        r8uint: gl.RED,
        r8sint: gl.RED,

        // 16bit format
        r16uint: gl.RED,
        r16sint: gl.RED,
        r16float: gl.RED,
        rg8unorm: gl.RG,
        rg8snorm: gl.RG,
        rg8uint: gl.RG,
        rg8sint: gl.RG,

        // 32bit format
        r32uint: gl.RED,
        r32sint: gl.RED,
        r32float: gl.RED,
        rg16uint: gl.RG,
        rg16sint: gl.RG,
        rg16float: gl.RG,
        rgba8unorm: gl.RGBA,
        'rgba8unorm-srgb': gl.RGBA,

        // packed 32bit format
        rgba8snorm: gl.RGBA,
        rgba8uint: gl.RGBA,
        rgba8sint: gl.RGBA,
        bgra8unorm: gl.RGBA,
        'bgra8unorm-srgb': gl.RGBA,

        // 64bit format
        rg32uint: gl.RG,
        rg32sint: gl.RG,
        rg32float: gl.RG,
        rgba16uint: gl.RGBA,
        rgba16sint: gl.RGBA,
        rgba16float: gl.RGBA,

        // 128bit format
        rgba32uint: gl.RGBA,
        rgba32sint: gl.RGBA,
        rgba32float: gl.RGBA,
    }
}

