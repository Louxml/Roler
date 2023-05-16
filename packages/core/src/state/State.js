

const BLEND = 0;
const OFFSET = 1;
const CULLING = 2;
const DEPTH_TEST = 3;
const WINDING = 4;
const DEPTH_MASK = 5;

export class State{
    /**
     * 状态数据
     * @Number
     * @public
     */
    #data;

    constructor(){
        this.#data = 0;

        this.blend = true;
        this.depthMask = true;
    }

    get data(){
        return this.#data;
    }

    /**
     * 计算片元颜色的混合
     * @default true
     */
    get blend(){
        return !!(this.#data & (1 << BLEND));
    }

    set blend(value){
        this.#data ^= (this.blend ^ !!value) << BLEND;
    }

    /**
     * 多边形深度偏移
     * @default false
     */
    get offsets(){
        return !!(this.#data & (1 << OFFSET));
    }

    set offsets(value){
        this.#data ^= (this.offsets ^ !!value) << OFFSET;
    }

    /**
     * 多边形剔除
     * @default false
     */
    get culling(){
        return !!(this.#data & (1 << CULLING));
    }

    set culling(value){
        this.#data ^= (this.culling ^ !!value) << CULLING;
    }

    /**
     * 深度测试
     * @default false
     */
    get depthTest(){
        return !!(this.#data & (1 << DEPTH_TEST));
    }

    set depthTest(value){
        this.#data ^= (this.depthTest ^ !!value) << DEPTH_TEST;
    }

    /**
     * 是否开启深度缓冲区
     * @default true
     */
    get depthMask(){
        return !!(this.#data & (1 << DEPTH_MASK));
    }

    set depthMask(value){
        this.#data ^= (this.depthMask ^ !!value) << DEPTH_MASK;
    }

    /**
     * 是否顺时针为正面
     * @default false
     */
    get clockwiseFrontFace(){
        return !!(this.#data & (1 << WINDING));
    }

    set clockwiseFrontFace(value){
        this.#data ^= (this.clockwiseFrontFace ^ !!value) << WINDING;
    }

    toString(){
        return `[Roler/core:State `
            + `blendMode=${this.blendMode} `
            + `clockwiseFrontFace=${this.clockwiseFrontFace} `
            + `culling=${this.culling} `
            + `depthMask=${this.depthMask} `
            + `polygonOffset=${this.polygonOffset}`
            + `]`;
    }
}