

let TABLE;
const TYPES = {
    FLOAT:          "float",
    FLOAT_VEC2:     "vec2",
    FLOAT_VEC3:     "vec3",
    FLOAT_VEC4:     "vec4",
    
    INT:            "int",
    INT_VEC2:       "ivec2",
    INT_VEC3:       "ivec3",
    INT_VEC4:       "ivec4",

    UNSIGNED_INT:       "unit",
    UNSIGNED_INT_VEC2:  "uvec2",
    UNSIGNED_INT_VEC3:  "uvec3",
    UNSIGNED_INT_VEC4:  "uvec4",

    BOOL:           "bool",
    BOOL_VEC2:      "bvec2",
    BOOL_VEC3:      "bvec3",
    BOOL_VEC4:      "bvec4",

    FLOAT_MAT2:     "mat2",
    FLOAT_MAT3:     "mat3",
    FLOAT_MAT4:     "mat4",

    SAMPLER_2D:                 "sampler2D",
    INT_SAMPLER_2D:             "sampler2D",
    UNSIGNED_INT_SAMPLER_2D:    "sampler2D",

    SAMPLER_CUBE:               "samplerCube",
    INT_SAMPLER_CUBE:           "samplerCube",
    UNSIGNED_INT_SAMPLER_CUBE:  "samplerCube",

    SAMPLER_2D_ARRAY:               "sampler2DArray",
    INT_SAMPLER_2D_ARRAY:           "sampler2DArray",
    UNSIGNED_INT_SAMPLER_2D_ARRAY:  "sampler2DArray"
}

export function mapType(gl, type){
    
    if (!TABLE){
        const typeNames = Object.keys(TYPES);

        TABLE = {}

        for (let i = 0; i < typeNames.length; i++){
            const name = typeNames[i];

            TABLE[gl[name]] = TYPES[name];
        }
    }

    return TABLE[type];
}