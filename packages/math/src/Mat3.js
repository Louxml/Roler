

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
            this.#data = arr;
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

    inverse(){
        
    }

    toString(){
        return `[Roler/math:Mat3 data = ${this.data}`;
    }
}