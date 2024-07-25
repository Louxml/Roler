

export class Rectangle {

    get type(){
        return 'rectangle';
    }

    x;

    y;

    width;

    height;
    
    constructor(x = 0, y = 0, width = 0, height = 0) {
        this.x = Number(x);
        this.y = Number(y);
        this.width = Number(width);
        this.height = Number(height);
    }

    get left(){
        return this.x;
    }

    get right(){
        return this.x + this.width;
    }

    get bottom(){
        return this.y;
    }

    get top(){
        return this.y + this.height;
    }

    isEmpty(){
        return this.width === 0 || this.height === 0;
    }

    static get EMPTY(){
        return new Rectangle(0, 0, 0, 0);
    }

    clone(){
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    // TODO Bounds
    // copyFromBounds(bounds){
        
    // }

    /**
     * 将矩形区域复制到当前矩形区域
     * @param {Rectangle} rectangle 矩形区域
     * @returns 
     */
    copyFrom(rectangle){
        this.x = rectangle.x;
        this.y = rectangle.y;
        this.width = rectangle.width;
        this.height = rectangle.height;

        return this
    }

    /**
     * 将当前矩形区域复制到矩形区域
     * @param {Rectangle} rectangle 矩形区域
     * @returns 
     */
    copyTo(rectangle){
        rectangle.copyFrom(this);

        return rectangle;
    }

    /**
     * 判断当前矩形区域是否包含点(x, y)
     * @param {Number} x 
     * @param {Number} y 
     * @returns 
     */
    contains(x, y){
        return (
            x >= this.left &&
            x < this.right &&
            y >= this.bottom &&
            y < this.top
        );
    }

    /**
     * 判断当前矩形区域是否包含点(x, y)，考虑描边宽度
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} stroke 矩形的描边宽度
     * @returns 
     */
    strokeContains(x, y, stroke){

        const halfStroke = stroke / 2;
        
        return (
            x >= this.left - halfStroke && x <= this.left + halfStroke &&
            x >= this.right - halfStroke && x <= this.right + halfStroke &&
            y >= this.bottom - halfStroke && y <= this.bottom + halfStroke &&
            y >= this.top - halfStroke && y <= this.top + halfStroke
        )
    }

    // TODO 矩形与形变之后的矩形是否相交
    intersects(rectangle, transform = null){
        
    }

    /**
     * 通过增加内边距来扩大矩形
     * @param {Number} paddingX x方向上的内边距
     * @param {Number} paddingY y方向上的内边距
     * @returns this
     */
    pad(paddingX, paddingY = paddingX){
        this.x -= paddingX;
        this.y -= paddingY;
        this.width += paddingX * 2;
        this.height += paddingY * 2;

        return this;
    }

    /**
     * 转换成两矩形相交的矩形（交集）
     * @param {Rectangle} rectangle 矩形
     * @returns this
     */
    fit(rectangle){
        const x1 = Math.max(this.left, rectangle.left);
        const x2 = Math.min(this.right, rectangle.right);
        const y1 = Math.max(this.bottom, rectangle.bottom);
        const y2 = Math.min(this.top, rectangle.top);

        this.x = x1;
        this.width = Math.max(0, x2 - x1);
        this.y = y1;
        this.height = Math.max(0, y2 - y1);

        return this;
    }

    /**
     * 通过放大矩形对齐像素网络（精度对齐）
     * @param {Number} resolution resolution
     * @param {Number} eps 精度
     * @returns this
     * 
     */
    ceil(resolution = 1, eps = 0.001){
        const x2 = Math.ceil((this.right - eps) * resolution) / resolution;
        const y2 = Math.ceil((this.top - eps) * resolution) / resolution;

        this.x = Math.floor((this.left + eps) * resolution) / resolution;
        this.y = Math.floor((this.bottom + eps) * resolution) / resolution;

        this.width = x2 - this.x;
        this.height = y2 - this.y;

        return this;
    }

    /**
     * 转换成两矩形合并的矩形（并集）
     * @param {Rectangle} rectangle 矩形
     * @returns this
     */
    enlarge(rectangle){
        const x1 = Math.min(this.left, rectangle.left);
        const x2 = Math.max(this.right, rectangle.right);
        const y1 = Math.min(this.bottom, rectangle.bottom);
        const y2 = Math.max(this.top, rectangle.top);
        
        this.x = x1;
        this.width = x2 - x1;
        this.y = y1;
        this.height = y2 - y1;

        return this;
    }

    // TODO Bounds
    // getBounds(out){

    // }

    toStirng(){
        return `[Roler/math:Rectangle x=${this.x} y=${this.y} width=${this.width} height=${this.height}]`;
    }
}