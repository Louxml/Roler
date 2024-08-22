// import { UNIFORM_TYPSE_VALUES } from "../../shared/shader/types"

import { WGSL_TO_STD40_SIZE } from "./createUboElementsSTD40.js";

// UniformData = {
//     value: TypeArray,
//     type:UNIFORM_TYPSE_VALUES,
//     size: Number,
//     offset: Number,
// }


// UboElement = {
//     data: UniformData,
//     offset: Number,
//     size: Number,
// }

/**
 * 生成数组同步代码,遵循std140规范,通用数据处理
 * @param {UboElement} uboElement 
 * @param {Number} offsetToAdd 
 */
export function generateArraySyncSTD40(uboElement, offsetToAdd) {
    
    // 行数
    const rowSize = Math.max(WGSL_TO_STD40_SIZE[uboElement.data.type] / 16, 1);
    // 单个元素大小
    const elementSize = uboElement.data.value.length / uboElement.data.size;
    // 剩余空间
    const remainder = (4 - (elementSize % 4)) % 4;

    return `
        v = uv.${uboElement.data.name};
        offset += ${offsetToAdd};

        arrayOffset = offset;

        t = 0;

        for (var i = 0; i < ${uboElement.data.size * rowSize}; i++){
            for (var j = 0; j < ${elementSize}; j++){
                data[arrayOffset++] = v[t++];
            }
            arrayOffset += ${remainder};
        }
    `;

}