
/**
 * 判断数值是否是2的指数幂
 * @param {Number} v 数值
 * @returns Boolean
 */
export function isPow2(v){
    return !(v & (v - 1)) && (!!v);
}