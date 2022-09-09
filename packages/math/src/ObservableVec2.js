import { Vec2 } from "./Vec2.js";

export class ObservableVec2 extends Vec2{

    cb = ()=>{};

    context = null;

    set x(v){
        if(super.x !== v){
            super.x = v;
            if(this.cb)this.cb.call(this.context)
        }
    }

    set y(v){
        if(super.y !== v){
            super.y = v;
            if(this.cb)this.cb.call(this.context)
        }
    }

    constructor(cb = ()=>{}, context = null, x = 0, y = 0){
        super(x, y);

        this.cb = cb;
        this.context = context;
    }
}