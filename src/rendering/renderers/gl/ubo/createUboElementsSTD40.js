

// 单位字节
export const WGSL_TO_STD40_SIZE = {
    f32: 4,
    'vec2<f32>': 8,
    'vec3<f32>': 12,
    'vec4<f32>': 16,

    /**
     * 矩阵统一用4*4的矩阵存储，每行数据必须是16字节的倍数(字节对齐)
     * 如下2*2矩阵
     * [a, b, 0, 0]
     * [c, d, 0, 0]
     * [0, 0, 0, 0]
     * [0, 0, 0, 0]
     */
    'mat2x2<f32>': 16 * 2,
    'mat3x3<f32>': 16 * 3,
    'mat4x4<f32>': 16 * 4,
}

/**
 * 
 * @param {UnifromData[]} uniformData 
 */
export function createUboElementsSTD40(uniformData){
    const uboElements = uniformData.map((data) => ({
        data,
        offset: 0,
        size: 0
    }))

    let size = 0;
    let chunkSize = 0;
    let offset = 0;

    for (let i = 0; i < uboElements.length; i++){
        const element = uboElements[i];
        const type = element.data.type;
        // 当前类型所占的字节数
        size = WGSL_TO_STD40_SIZE[type];

        // 位置类型处理
        if (!size){
            throw new Error(`Ubo: type ${type} not support`);
        }

        // 数量大于 1 时，需要按4字节对齐
        if (element.data.size > 1){
            size = Math.max(size, 16) * element.data.size;
        }
        element.size = size;

        // TODO　字节对齐处理
        if (chunkSize % size !== 0 && chunkSize < 16){
            const lineUplValue = (chunkSize % size) % 16;

            chunkSize += lineUplValue;
            offset += lineUplValue;
        }
        
        if ((chunkSize + size) > 16){
            offset = Math.ceil(offset / 16) * 16;
        }

        element.offset = offset;
        offset += size;
        chunkSize += size;
    }
    
    offset = Math.ceil(offset / 16) * 16;

    return {uboElements, size: offset};
}