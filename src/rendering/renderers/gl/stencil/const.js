

// 模板比较模式
export const STENCIL_COMPARE_MODES = {
    /** 永不通过 */
    never: 0x0200,
    /** 小于存储值通过 */
    less: 0x0201,
    /** 等于存储值通过 */
    equal: 0x0202,
    /** 小于等于存储值通过 */
    'less-equal': 0x0203,
    /** 大于存储值通过 */
    greater: 0x0204,
    /** 不等于存储值通过 */
    'not-equal': 0x0205,
    /** 大于等于存储值通过 */
    'greater-equal': 0x0206,
    /** 总是通过 */
    always: 0x0207,
};

// 模板缓冲区操作模式
export const STENCIL_OPERATE_MODES = {
    keep: 0x1e00,
    replace: 0x1e01,
    incr: 0x1e02,
    decr: 0x1e03,
    invert: 0x150a,
    'invr-wrap': 0x8507,
    'decr-wrap': 0x8508,
}