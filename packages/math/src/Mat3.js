

/**
 * 
 */
export class Mat3{

    /**
     * 矩阵数据
     * @private
     */
    #data = [1, 0, 0, 0, 1, 0, 0, 0, 1];

    get data(){
        return this.#data.map(v=>v);
    }

    /**
     * 零矩阵
     * @static
     */
    static get ZERO(){
        return new Mat3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    /**
     * 单位矩阵
     * @static
     */
    static get IDENTITY(){
        return new Mat3([1, 0, 0, 0, 1, 0, 0, 0, 1]);
    }

    /**
     * 创建平移矩阵
     * @param {Number} x x轴
     * @param {Number} y y轴
     * @static
     * @returns Mat3
     */
    static createTranslate(x = 0, y = 0){
        return new Mat3([1, 0, x, 0, 1, y, 0, 0, 1]);
    }

    /**
     * 创建旋转矩阵
     * @param {Number} r 弧度
     * @static
     * @returns Mat3
     */
    static createRotation(r = 0){
        return new Mat3([Math.cos(r), -Math.sin(r), 0, Math.sin(r), Math.cos(r), 0, 0, 0, 1]);
    }
    
    /**
     * 创建缩放矩阵
     * @param {Number} x x轴
     * @param {Number} y y轴
     * @static
     * @returns Mat3
     */
    static createScale(x = 0, y = 0){
        return new Mat3([x, 0, 0, 0, y, 0, 0, 0, 1]);
    }

    /**
     * 创建倾斜矩阵
     * @param {Number} x x轴
     * @param {Number} y y轴
     * @static
     * @returns this
     */
    static createSkew(x = 0, y = 0){
        return new Mat3([1, x, 0, y, 1, 0, 0, 0, 1]);
    }

    constructor(data){
        this.set(data);
    }

    /**
     * 设置矩阵
     * @param {Array} arr 长度为9的数组
     * @public
     * @returns this
     */
    set(arr){
        if(arr instanceof Array && arr.length == 9){
            this.#data = arr.map(v=>v);
        }
        return this;
    }

    /**
     * 矩阵相加
     * @param {Mat3} m 三维矩阵
     * @public
     * @returns this
     */
    add(m){
        if(!(m instanceof Mat3)){
            throw "Mat3 Error";
        }
        const d = m.data;
        for(let i = 0; i < 9;i ++){
            this.#data[i] += d[i]
        }

        return this;
    }

    /**
     * 矩阵相减
     * @param {Mat3} m 三维矩阵
     * @public
     * @returns this
     */
    sub(m){
        if(!(m instanceof Mat3)){
            throw "Mat3 Error";
        }
        
        const d = m.data;
        for(let i = 0; i < 9;i ++){
            this.#data[i] -= d[i]
        }

        return this;
    }

    /**
     * 矩阵相乘
     * @param {Mat3} m 三维矩阵
     * @public
     * @returns this
     */
    multiply(m){
        if(!(m instanceof Mat3)){
            throw "Mat3 Error";
        }
        
        const a = this.data;
        const b = m.data;
        const res = new Array(9).fill(0);
        for (let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++){
                for (let k = 0; k < 3; k++){
                    res[i*3+j] += a[i*3+k] * b[k*3+j];
                }
            }
        }
        return this.set(res);
    }

    /**
     * 判断矩阵是否相等
     * @param {Mat3} m 三维矩阵
     * @public
     * @returns 是否相等
     */
    equals(m){
        const d = m.data
        return this.data.every((v, i) => {
            return v == d[i];
        })
    }

    /**
     * 矩阵单位化
     * @public
     * @returns this
     */
    identity(){
        return this.set(Mat3.IDENTITY.data);
    }

    /**
     * 判断矩阵是否单位矩阵
     * @public
     * @returns 是否单位矩阵
     */
    isIdentity(){
        return this.equals(Mat3.IDENTITY);
    }

    /**
     * 置换矩阵
     * @public
     * @returns this
     */
    transpose(){
        const d = this.data;
        return this.set([
            d[0], d[3], d[6],
            d[1], d[4], d[7],
            d[2], d[5], d[8]
        ]);
    }

    /**
     * 克隆矩阵对象
     * @public
     * @returns this
     */
    clone(){
        return new Mat3(this.data);
    }

    /**
     * 逆矩阵
     * @public
     * @returns this
     */
    inverse(){
        const d = this.data;
        const det = d[0]*(d[4]*d[8] - d[5]*d[7]) + d[1]*(d[5]*d[6] - d[3]*d[8]) + d[2]*(d[3]*d[7] - d[4]*d[6]);
        const res = new Array(9).fill(0);

        if(det != 0){
            res[0] = (d[4]*d[8] - d[5]*d[7])/det;
            res[1] = (d[7]*d[2] - d[8]*d[1])/det;
            res[2] = (d[1]*d[5] - d[2]*d[4])/det;
            res[3] = (d[5]*d[6] - d[3]*d[8])/det;
            res[4] = (d[8]*d[0] - d[2]*d[6])/det;
            res[5] = (d[2]*d[3] - d[0]*d[5])/det;
            res[6] = (d[3]*d[7] - d[4]*d[6])/det;
            res[7] = (d[6]*d[1] - d[0]*d[7])/det;
            res[8] = (d[0]*d[4] - d[1]*d[3])/det;
        }

        return this.set(res)
    }

    /**
     * 设置模型矩阵
     * Translate * Rotation * Skew * Scale * Pivot
     * @param {Number} tx x位移
     * @param {Number} ty y位移
     * @param {Number} r 弧度
     * @param {Number} sx x缩放
     * @param {Number} sy y缩放
     * @param {Number} kx x倾斜偏移
     * @param {Number} ky y倾斜偏移
     * @param {Number} px x偏移
     * @param {Number} py y偏移
     * @public
     * @return this
     */
    setTransform(tx = 0, ty = 0, r = 0, sx = 1, sy = 1, kx = 0, ky = 0, px = 0, py = 0){
        const d = [1, 0, 0, 0, 1, 0, 0, 0, 1];
        d[0] = Math.cos(r + ky) * sx;
        d[3] = Math.sin(r + ky) * sx;
        d[1] = -Math.sin(r - kx) * sy;
        d[4] = Math.cos(r -kx) * sy;
        d[2] = tx - px*d[0] - py*d[1];
        d[5] = ty - px*d[3] - py*d[4];

        return this.set(d);
    }

    /**
     * 分解矩阵输出Transform属性
     * @param {Transform} transform 变换属性
     * @public
     * @returns Transform
     */
    decompose(transform){
        const d = this.data;
        const pivot = transform.pivot;

        const skewX = -Math.atan2(-d[1], d[4]);
        const skewY = Math.atan2(d[3], d[0]);

        const delta = Math.abs(skewX + skewY);

        if (delta < 0.00001 || Math.abs(2*Math.PI - delta) < 0.00001){
            transform.rotation = skewY;
            transform.skew.x = transform.skew.y = 0;
        }else{
            transform.rotation = 0;
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }

        // next set scale
        transform.scale.x = Math.sqrt((d[0] ** 2) + (d[1] ** 2));
        transform.scale.y = Math.sqrt((d[3] ** 2) + (d[4] ** 2));

        // next set position
        transform.position.x = d[2] + ((pivot.x * d[0]) + (pivot.y * d[1]));
        transform.position.y = d[5] + ((pivot.x * d[3]) + (pivot.y * d[4]));

        return transform;
    }

    /**
     * 平移
     * @param {Number} x x轴
     * @param {Number} y y轴
     * @public
     * @returns this
     */
    translate(x = 0, y = 0){
        const d = this.data;
        d[2] += x;
        d[5] += y;
        return this.set(d);
    }

    /**
     * 旋转
     * @param {Number} r 弧度
     * @public
     * @returns this
     */
    rotate(r = 0){
        const m = Mat3.createRotation(r).multiply(this);
        return this.set(m.data);
    }

    /**
     * 缩放
     * @param {Number} x x轴
     * @param {Number} y y轴
     * @public
     * @returns this
     */
    scale(x = 0, y = 0){
        const d = this.data;
        d[0] *= x;
        d[1] *= x;
        d[2] *= x;
        d[3] *= y;
        d[4] *= y;
        d[5] *= y;
        
        return this.set(d);
    }

    toString(){
        let str = "[Roler/math:Mat3 data =";
        const d = this.data;
        for(let i = 0;i < 9;i++){
            if(i%3==0)str += "\n";
            str += "\t" + d[i];
        }
        return str;
    }
}