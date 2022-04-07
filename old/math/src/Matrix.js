import { Point } from "./Point.js"

export class Matrix{
    a; c; tx;
    b; d; ty;
    array;

    constructor(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 1){
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
    }

    fromArray(a){
        this.a = a[0];
        this.b = a[1];
        this.c = a[3];
        this.d = a[4];
        this.tx = a[2];
        this.ty = a[5];
    }

    sets(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 1){
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        return this;
    }

    toArray(transpose, out){
        if (!this.array){
            this.array = new Float32Array(9);
        }

        let a = out || this.array;
        if (transpose){
            a[0] = this.a;
            a[1] = this.b;
            a[2] = 0;
            a[3] = this.c;
            a[4] = this.d;
            a[5] = 0;
            a[6] = this.tx;
            a[7] = this.ty;
            a[8] = 1;
        }else{
            a[0] = this.a;
            a[1] = this.c;
            a[2] = this.tx;
            a[3] = this.b;
            a[4] = this.d;
            a[5] = this.ty;
            a[6] = 0;
            a[7] = 0;
            a[8] = 1;
        }

        return a;
    }

    /**
     *使用应用的当前变换获取新位置。
     *可以用于从子坐标空间转到世界坐标空间。（例如渲染）
     *
     * @param {Point} pos 
     * @param {Point} newPos 
     * @returns 
     */
    apply(pos, newPos){
        newPos = newPos || new Point();
        const x = pos.x;
        const y = pos.y;
        newPos.x = (this.a * x) + (this.c * y) + this.tx;
        newPos.y = (this.b * x) + (this.d * y) + this.ty;

        return newPos;
    }

    /**
     *获得一个新的位置，并应用当前变换的倒数。
     *可以用于从世界坐标空间转到子坐标空间。（例如输入）
     *
     * @param {Point} pos 
     * @param {Point} newPos 
     */
    applyInverse(pos, newPos){
        newPos = newPos || new Point();
        const id = 1 / (this.a * this.d + this.c * -this.b);
        const x = pos.x;
        const y = pos.y;

        newPos.x = (this.d * id * x) + (-this.c * id * y) + ((this.ty * this.c - this.tx * this.d) * id);
        newPos.y = (this.a * id * y) + (-this.b * id * x) + ((-this.ty * this.a + this.tx * this.b) * id);
    }

    translate(x, y){
        this.tx += x;
        this.ty += y;
        return this;
    }

    scale(x, y){
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;
        return this;
    }

    rotate(angle){
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;

        this.a = a * cos - b * sin;
        this.b = a * sin + b * cos;
        this.c = c * cos - d * sin;
        this.d = c * sin + d * cos;
        this.tx = tx * cos - ty * sin;
        this.ty = tx * sin + ty * cos;

        return this;
    }

    append(m){
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;
        this.a = m.a * a + m.b * c;
        this.b = m.a * b + m.b * d;
        this.c = m.c * a + m.d * c;
        this.d = m.c * b + m.d * d;
        this.tx = m.tx * a + m.ty * c + tx;
        this.ty = m.tx * b + m.ty * d + ty;
        return this;
    }

    prepend(m){
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;
        this.a = a * m.a + b * m.c;
        this.b = a * m.b + b * m.d;
        this.c = c * m.a + d * m.c;
        this.d = c * m.b + d * m.d;
        this.tx = tx * m.a + ty * m.c + m.tx;
        this.ty = tx * m.b + ty * m.d + m.ty;
        return this;
    }

    setTransform(x, y, pivotX, pivotY, scaleX, scaleY, rotation, skewX, skewY){
        this.a = Math.cos(rotation + skewY) * scaleX;
        this.b = Math.sin(rotation + skewY) * scaleX;
        this.c = -Math.sin(rotation - skewX) * scaleY;
        this.d = Math.cos(rotation - skewX) * scaleY;

        this.tx = x - (pivotX * this.a + pivotY * this.c);
        this.ty = y - (pivotX * this.b + pivotY * this.d);

        return this;
    }
    /**
     * 分解矩阵（x、y、scaleX、scaleY和旋转），并将属性设置为变换。
     *
     * @param {Transform} t 
     * @return {Transform}
     */
    decompose(t){
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;
        const piovt = t.piovt;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

        if (delta < 0.00001 || Math.abs(2 * Math.PI - delta) < 0.00001){
            t.rotation = skewY;
            t.skew.x = t.skew.y = 0;
        }else{
            t.rotation = 0;
            t.skew.x = skewX;
            t.skew.y = skewY;
        }

        t.scale.x = Math.sqrt(a ** 2 + b ** 2);
        t.scale.y = Math.sqrt(c ** 2 + d ** 2);
        t.position.x = tx + (piovt.x * a + piovt.y * c);
        t.position.y = ty + (piovt.x * b + piovt.y * d);
        return t;
    }

    invert(){
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;
        const tx = this.tx;
        const ty = this.ty;
        const n = a * d - b * c;
        
        this.a = d / n;
        this.b = -b / n;
        this.c = -c / n;
        this.d = a / n;
        this.tx = (c * ty - d * tx) / n;
        this.ty = -(a * ty - b * tx) / n;
        return this;
    }

    identity(){
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;
        return this;
    }

    clone(){
        const m = new Matrix();
        return m.sets(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    copyTo(m){
        return m.sets(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    copyFrom(m){
        return this.sets(m.a, m.b, m.c, m.d, m.tx, m.ty);
    }

    toString(){
        return `[@Role:Matrix a=${this.a} b=${this.b} c=${this.c} d=${this.d} tx=${this.tx} ty=${this.ty}]`;
    }

    static get IDENTITY(){
        return new Matrix();
    }

    static get TEMP_MATRIX(){
        return new Matrix();
    }
}