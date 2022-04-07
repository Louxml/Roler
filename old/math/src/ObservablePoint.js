export class ObservablePoint{
    /**更改'x'和/或'y'时触发的回调函数 */
    #cb = () => {};
    /** 回调所有者 */
    #scope;

    #x = 0;
    #y = 0;

    get x(){
        return this.#x;
    }

    set x(v){
        if (this.#x !== v){
            this.#x = v;
            this.#cb.call(this.#scope);
        }
    }

    get y(){
        return this.#y;
    }

    set y(v){
        if (this.#y !== v){
            this.#y = v;
            this.#cb.call(this.#scope);
        }
    }

    constructor(cb = ()=>{}, scope, x = 0, y = 0){
        this.#x = x;
        this.#y = y;
        this.#cb = cb;
        this.#scope = scope || this;
    }

    clone(cb = this.#cb, scope = this.#scope){
        return new ObservablePoint(cb, scope, this.#x, this.#y);
    }

    set(x = 0, y = x){
        if (this.#x === x && this.#y === y)return this;
        this.#x = x;
        this.#y = y;
        this.#cb.call(this.#scope);
        return this;
    }

    copyFrom(p){
        return this.set(p.x, p.y);
    }

    copyTo(p){
        return p.set(this.#x, this.#y);
    }

    equals(p){
        return this.#x === p.x && this.#y === p.y;
    }

    toString(){
        return `[@Role:ObservablePoint x=${this.#x} y=${this.#y} scope=${this.#scope}]`;
    }
}