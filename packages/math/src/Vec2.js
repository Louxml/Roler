
/**
 * 二维向量
 */
export class Vec2{

    /**
     * x 轴
     * @private
     */
    #x = 0;
    
    /**
     * y 轴
     * @private
     */
    #y = 0;

    get x(){
        return this.#x;
    }

    get y(){
        return this.#y;
    }

    /**
     * 零向量
     * @returns 
     */
    static get ZERO(){
        return new Vec2(0, 0);
    }

    /**
     * x轴方向单位向量
     * @returns 
     */
    static get UNIT_X(){
        return new Vec2(1, 0);
    }

    /**
     * y轴方向单位向量
     * @returns 
     */
    static get UNIT_Y(){
        return new Vec2(0, 1);
    }

    /**
     * 获取两向量中点的向量
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @returns 二维向量
     */
    static getMidPoint(a, b){
        return new Vec2(a.x + (b.x - a.x)/2, a.y + (b.y - a.y)/2);
    }

    /**
     * 获取 a 向量在 b 向量的投影向量
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @returns 二维向量
     */
    static getProject(a, b){
        return b.clone().scale(a.dot(b)/b.lengthSquared());
    }

    constructor(x = 0, y = 0){
        this.#x = x;
        this.#y = y;
    }

    /**
     * 克隆二维向量对象
     * @param {Vec2} v 二维向量
     * @oublic
     * @returns 二维向量
     */
    clone(){
        return new Vec2(this.#x, this.#y);
    }

    /**
     * 设置二维向量
     * @param {Number} x 
     * @param {Number} y 默认用x的值
     * @public
     * @returns 二维向量 （链式调用）
     */
    set(x = 0, y = x){
        this.#x = x;
        this.#y = y;
        return this;
    }

    /**
     * 判断二维向量是否相等
     * @param {Vec2} v 判断向量
     * @pubic
     * @returns 是否相等
     */
    equals(v){
        return this.#x === v.x && this.#y === v.y;
    }

    /**
     * 向量相加
     * @param {Vec2} v 二维向量
     * @public
     * @returns 二维向量
     */
    add(v){
        this.#x += v.x;
        this.#y += v.y;
        return this;
    }

    /**
     * 向量相减
     * @param {Vec2} v 二维向量
     * @public
     * @returns 二维向量
     */
    sub(v){
        this.#x -= v.x;
        this.#y -= v.y;
        return this;
    }

    /**
     * 向量点乘
     * @param {Vec2} v 二维向量
     * @public
     * @returns 数值
     */
    dot(v){
        return this.#x * v.x + this.#y * v.y
    }

    /**
     * 向量叉乘
     * @param {Vec2} v 二维向量
     * @public
     * @returns 数值
     */
    cross(v){
        return this.#x * v.y - this.#y * v.x;
    }

    /**
     * 向量缩放
     * @param {Number} s 缩放比例
     * @public
     * @returns 二维向量
     */
    scale(s){
        this.#x *= s;
        this.#y *= s;
        return this;
    }

    /**
     * 向量与x轴夹角
     * @public
     * @returns 角度
     */
    angle(){
        return Math.atan2(this.#y, this.#x) * 180 / Math.PI;
    }

    /**
     * 向量单位化
     * @public
     * @returns 二维向量
     */
    normalize(){
        return this.scale(1/this.length());
    }

    rotate(deg, v = Vec2.ZERO){
        this.sub(v);
        const r = deg / 180 * Math.PI;
        const x = this.#x;
        const y = this.#y;
        this.#x = x * Math.cos(r) - y * Math.sin(r);
        this.#y = x * Math.sin(r) + y * Math.cos(r);
        this.add(v);
        return this;
    }

    /**
     * 向量长度平方
     * @public
     * @returns 数值
     */
    lengthSquared(){
        return this.#x ** 2 + this.#y ** 2;
    }

    /**
     * 向量长度
     * @public
     * @returns 数值
     */
    length(){
        return Math.sqrt(this.lengthSquared());
    }



    /**
     * 字符串形式（多用于调试）
     * @pubic
     * @returns 对象字符串输出
     */
    toString(){
        return `[Roler/math:Vec2 x=${this.#x} y=${this.#y}]`;
    }
}