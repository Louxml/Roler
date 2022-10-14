import { Size } from "./Size.js";


export class ObservableSize extends Size{

    cb = () => {};

    context = null;

    get width(){
        return super.width;
    }

    set width(v){
        if(super.width !== v){
            super.width = v;
            if(this.cb)this.cb.call(this.context)
        }
    }

    get height(){
        return super.height;
    }

    set height(v){
        if(super.height !== v){
            super.height = v;
            if(this.cb)this.cb.call(this.context)
        }
    }

    constructor(w = 0, h = 0, cb = ()=>{}, context = null){
        super(w, h);

        this.cb = cb;
        this.context = context;
    }

    /**
     * 复制对象
     * @public
     * @returns Size
     */
    clone(cb = this.cb, context = this.context){
        return new ObservableSize(super.width, super.height, cb, context);
    }
}