

// 是否为2的指数幂
export function isPow2(v){
    return !(v & (v - 1)) && (!!v);
}