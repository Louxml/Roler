

const BLEND_MODES = {
    normal: 0,
    add: 1,
    multiply: 2,
    screen: 3,
    overlay: 4,
    erase: 5,
    'normal-npm': 6,
    'add-npm': 7,
    'screen-npm': 8,
};

const BLEND = 0;
const OFFSET = 1;
const CULLING = 2;
const DEPTH_TEST = 3;
const DEPTH_MASK = 4;
const WINDING = 5;

export class State{
    /**
     * 状态数据（二进制开关）
     * @Number
     * @private
     */
    #data;

    /**
     * 混合模式
     * @Number
     * @private
     */
    #blendMode;

    /**
     * 多边形偏移量
     * @Number
     * @private
     */
    #polygonOffset;

    constructor(){
        this.#data = 0;

        this.blendMode = 'normal';
        this.polygonOffset = 0;

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
     * 是否开启写入深度缓冲区
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

    /**
     * 剔除模式
     * @default 'none'
     */
    get cullMode(){
        return this.culling ? (this.clockwiseFrontFace ? 'front' : 'back') : 'none';
    }

    set cullMode(value){
        this.culling = (value !== 'none');
        this.clockwiseFrontFace = (value === 'front');
    }

    /**
     * 混合模式
     * @default 'normal'
     */
    get blendMode(){
        return this.#blendMode;
    }

    set blendMode(value){
        this.blend = (value !== 'none');
        this.#blendMode = value;
    }

    /**
     * 多边形深度偏移量
     * @default false
     */
    get polygonOffset(){
        return this.#polygonOffset;
    }

    set polygonOffset(value){
        this.offsets = !!value;
        this.#polygonOffset = value;
    }

    toString(){
        return `[Roler/core:State\n`
            + `\tblendMode = ${this.blendMode}\n`
            + `\tclockwiseFrontFace = ${this.clockwiseFrontFace}\n`
            + `\tculling = ${this.culling}\n`
            + `\tcullMode = ${this.cullMode}\n`
            + `\tdepthTest = ${this.depthTest}\n`
            + `\tdepthMask = ${this.depthMask}\n`
            + `\tpolygonOffset = ${this.polygonOffset}\n`
            + `]`;
    }

    /**
     * 2d渲染state
     * @returns state
     */
    static for2d(){
        const state = new State();
        
        state.depthTest = false;
        state.blend = true;

        return state;
    }

    static default2d = State.for2d();
}