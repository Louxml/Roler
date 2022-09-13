import { Vec2 } from "./Vec2.js";

export class ObservableVec2 extends Vec2{

    cb = ()=>{};

    context = null;

    get x(){
        return super.x;
    }

    set x(v){
        if(super.x !== v){
            super.x = v;
            if(this.cb)this.cb.call(this.context)
        }
    }

    get y(){
        return super.y;
    }

    set y(v){
        if(super.y !== v){
            super.y = v;
            if(this.cb)this.cb.call(this.context)
        }
    }

    /**
     * 零向量
     * @returns 
     */
     static get ZERO(){
        return new ObservableVec2(0, 0);
    }

    /**
     * x轴方向单位向量
     * @returns 
     */
    static get UNIT_X(){
        return new ObservableVec2(1, 0);
    }

    /**
     * y轴方向单位向量
     * @returns 
     */
    static get UNIT_Y(){
        return new ObservableVec2(0, 1);
    }

    /**
     * 获取两向量中点的向量
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @returns 二维向量
     */
     static getMidPoint(a, b){
        return new ObservableVec2(a.x + (b.x - a.x)/2, a.y + (b.y - a.y)/2);
    }

    /**
     * 获取 a 向量在 b 向量的投影向量
     * @param {Vec2} a 二维向量
     * @param {Vec2} b 二维向量
     * @returns 二维向量
     */
    static getProject(a, b){
        return new ObservableVec2(b.x, b.y).scale(a.dot(b)/b.lengthSquared());
    }

    constructor(x = 0, y = 0, cb = ()=>{}, context = null){
        super(x, y);

        this.cb = cb;
        this.context = context;
    }

    /**
     * 克隆二维向量对象
     * @param {Vec2} v 二维向量
     * @oublic
     * @returns 二维向量
     */
    clone(cb = this.cb, context = this.context){
        return new ObservableVec2(super.x, super.y, cb, context);
    }

    /**
     * 字符串形式（多用于调试）
     * @pubic
     * @returns 对象字符串输出
     */
    toString(){
        return `[Roler/math:ObservableVec2 x=${super.x} y=${super.y} context=${this.context}]`;
    }
}