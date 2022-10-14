export class Size{
    /**
     * 宽度
     * @private
     */
    #w = 0;
    /**
     * 高度
     * @private
     */
    #h = 0;

    set width(v){
        this.#w = Number(v);
    }

    get width(){
        return this.#w;
    }

    set height(v){
        this.#h = v;
    }

    get height(){
        return this.#h;
    }

    constructor(w = 0, h = 0){
        this.set(w, h);
    }

    /**
     * 设置宽高
     * @public
     * @param {Number} w 宽度
     * @param {Number} h 高度
     */
    set(w = this.width, h = this.height){
        this.width = w;
        this.height = h;
    }

    /**
     * 设置宽度
     * @public
     * @param {Number} w 宽度
     */
    setWidth(w = this.width){
        this.width = w;
    }

    /**
     * 获取宽度
     * @public
     * @returns 宽度
     */
    getWidth(){
        return this.width;
    }

    /**
     * 设置高度
     * @public
     * @param {Number} h 高度
     */
    setHeight(h = this.height){
        this.height = h;
    }

    /**
     * 获取高度
     * @public
     * @returns 高度
     */
    getHeight(){
        return this.height;
    }

    /**
     * 复制对象
     * @public
     * @returns Size
     */
    clone(){
        return new Size(this.width, this.height);
    }

    /**
     * 字符串形式（多用于调试）
     * @pubic
     * @returns 对象字符串输出
     */
    toString(){
        return `[Roler/math:Size width=${this.width} height=${this.height}]`;
    }


}