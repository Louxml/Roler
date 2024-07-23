import { GL_TYPES } from "../../texture/const.js";

let GL_TABLE = null;

const GL_TO_GLSL_TYPES = {
    FLOAT:      'float',
    FLOAT_VEC2: 'vec2',
    FLOAT_VEC3: 'vec3',
    FLOAT_VEC4: 'vec4',

    INT:        'int',
    INT_VEC2:   'ivec2',
    INT_VEC3:   'ivec3',
    INT_VEC4:   'ivec4',

    UNSIGED_INT:        'uint',
    UNSIGNED_INT_VEC2:  'uvec2',
    UNSIGNED_INT_VEC3:  'uvec3',
    UNSIGNED_INT_VEC4:  'uvec4',

    BOOL:        'bool',
    BOOL_VEC2:   'bvec2',
    BOOL_VEC3:   'bvec3',
    BOOL_VEC4:   'bvec4',

    FLOAT_MAT2:   'mat2',
    FLOAT_MAT3:   'mat3',
    FLOAT_MAT4:   'mat4',

    SAMPLER_2D:                     'sampler2D',
    INT_SAMPLER_2D:                 'sampler2D',
    UNSIGNED_INT_SAMPLER_2D:        'sampler2D',
    SAMPLER_CUBE:                   'samplerCube',
    INT_SAMPLER_CUBE:               'samplerCube',
    UNSIGNED_INT_SAMPLER_CUBE:      'samplerCube',
    SAMPLER_2D_ARRAY:               'sampler2DArray',
    INT_SAMPLER_2D_ARRAY:           'sampler2DArray',
    UNSIGNED_INT_SAMPLER_2D_ARRAY:  'sampler2DArray',

    // SAMPLER_3D:                     'sampler3D',
}

// TODO 可优化 attribute.format、uniform.type、uniformGroup.type

const GLSL_TO_VERTEX_TYPES = {
    float:      'float32',
    vec2:       'float32x2',
    vec3:       'float32x3',
    vec4:       'float32x4',

    int:        'sint32',
    ivec2:      'sint32x2',
    ivec3:      'sint32x3',
    ivec4:      'sint32x4',

    uint:       'uint32',
    uvec2:      'uint32x2',
    uvec3:      'uint32x3',
    uvec4:      'uint32x4',

    bool:       'uint32',
    bvec2:      'uint32x2',
    bvec3:      'uint32x3',
    bvec4:      'uint32x4',
}

const FORMAT_TO_GL_TYPES = {
    uint8x2: GL_TYPES.UNSIGNED_BYTE,
    uint8x4: GL_TYPES.UNSIGNED_BYTE,
    sint8x2: GL_TYPES.BYTE,
    sint8x4: GL_TYPES.BYTE,

    uint16x2: GL_TYPES.UNSIGNED_SHORT,
    uint16x4: GL_TYPES.UNSIGNED_SHORT,
    sint16x2: GL_TYPES.SHORT,
    sint16x4: GL_TYPES.SHORT,

    uint32:   GL_TYPES.UNSIGNED_INT,
    uint32x2: GL_TYPES.UNSIGNED_INT,
    uint32x3: GL_TYPES.UNSIGNED_INT,
    uint32x4: GL_TYPES.UNSIGNED_INT,
    sint32:   GL_TYPES.INT,
    sint32x2: GL_TYPES.INT,
    sint32x3: GL_TYPES.INT,
    sint32x4: GL_TYPES.INT,

    float16x2:  GL_TYPES.HALF_FLOAT,
    float16x2:  GL_TYPES.HALF_FLOAT,
    float32:    GL_TYPES.FLOAT,
    float32x2:  GL_TYPES.FLOAT,
    float32x3:  GL_TYPES.FLOAT,
    float32x4:  GL_TYPES.FLOAT,
}

export function mapType(gl, type) {
    if (GL_TABLE) return GL_TABLE[type];

    const typeNames = Object.keys(GL_TO_GLSL_TYPES);

    GL_TABLE = {}

    for (let i = 0; i < typeNames.length; i++) {
        const typeName = typeNames[i];
        const typeValue = GL_TO_GLSL_TYPES[typeName];

        if (gl[typeName]) GL_TABLE[gl[typeName]] = typeValue;

    }
    
    return GL_TABLE[type];
}

/**
 * 获取格式
 * @param {WebGLRenderingContext} gl 
 * @param {Number} type gl数据类型
 * @returns 
 */
export function mapGLToVertexFormat(gl, type) {
    const typeValue = mapType(gl, type)

    return GLSL_TO_VERTEX_TYPES[typeValue] || 'float32';
}

/**
 * 获取数据类型
 * @param {String} format 格式
 */
export function mapGLTypeFromFormat(format){
    return FORMAT_TO_GL_TYPES[format] || FORMAT_TO_GL_TYPES.float32;
}