import { SHAPES } from "../"

export class Rectangle{
    x;
    y;
    width;
    height;
    #type;

    get type(){
        return this.#type;
    }

    constructor(x = 0, y = 0, width = 0, height = 0){
        this.x = Number(x);
        this.y = Number(y);
        this.width = Number(width);
        this.height = Number(height);
        this.#type = SHAPES.RECT;
    }

    get left(){
        return this.x;
    }

    get right(){
        return this.x + this.width;
    }

    get top(){
        return this.y;
    }

    get bottom(){
        return this.y + this.height;
    }

    static get EMPTY(){
        return new Rectangle(0, 0, 0, 0);
    }

    clone(){
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    copyFrom(rect){
        this.x = rect.x;
        this.y = rect.y;
        this.width = rect.width;
        this.height = rect.height;
        return this;
    }

    copyTo(rect){
        return rect.copyFrom(this);
    }

    /**
     * 检查给定的x和y坐标是否包含在此矩形内
     *
     * @param {Number} x 
     * @param {Number} y 
     * @return {Boolean}
     */
    contains(x, y){
        if (this.width <= 0 || this.height <= 0){
            return false;
        }

        if (x >= this.x && x <= this.x + this.width && 
            y >= this.y && y <= this.y + this.height){
            return true;
        }

        return false;
    }

    /**
     * 填充矩形，使其向各个方向生长。
     * 
     * @param {Number} pX 
     * @param {Number} pY 
     */
    pad(pX = 0, pY = pX){
        this.x -= pX;
        this.y -= pY;

        this.width += pX * 2;
        this.height += pY * 2;

        return this;
    }

    /**
     * 围绕传递的矩形拟合此矩形。
     *
     * @param {Rectangle} rect 
     */
    fit(rect){
        const x1 = Math.max(this.x, rect.x);
        const x2 = Math.min(this.x + this.width, rect.x + rect.width);
        const y1 = Math.max(this.y, rect.y);
        const y2 = Math.min(this.y + this.height, rect.y + rect.height);

        this.x = x1;
        this.width = Math.max(x2 - x1, 0);
        this.y = y1;
        this.height = Math.max(y2 - y1, 0);

        return this;
    }

    ceil(res = 1, eps = 0.001){
        const x2 = Math.ceil((this.x + this.width - eps) * res) / res;
        const y2 = Math.ceil((this.y + this.height - eps) * res) / res;

        this.x = Math.floor((this.x + eps) * res) / res;
        this.y = Math.floor((this.y + eps) * res) / res;

        return this;
    }

    enlarge(rect){
        const x1 = Math.min(this.x, rect.x);
        const x2 = Math.max(this.x + this.width, rect.x + rect.width);
        const y1 = Math.min(this.y, rect.y);
        const y2 = Math.max(this.y + this.height, rect.y + rect.height);

        this.x = x1;
        this.width = x2 - x1;
        this.y = y1;
        this.height = y2 - y1;

        return this;
    }

    toString(){
        return `[@Role/math:Rectangle x=${this.x} y=${this.y} width=${this.widht} height=${this.height}]`;
    }



}