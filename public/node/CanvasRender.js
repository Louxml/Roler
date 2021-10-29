import Mat3 from "../core/mat3.js";
import Vec2 from "../core/vec2.js";
class CanvasRenderer{

    #size = new Vec2(0, 0);
    #refrash = true;
    #renderer;
    #data = [];
    #viewTransform = Mat3.UNIT;
    constructor(w = 0, h = 0){
        this.size = new Vec2(w, h);
        this.#renderer = document.createElement("canvas").getContext("2d");
        this.#renderer.canvas.width = w;
        this.#renderer.canvas.height = h;
    }

    set size(v){
        if(v.constructor.name === Vec2.name){
            this.#size = v;
        }else return;
    }

    get size(){
        return this.#size.clone();
    }

    get canvas(){
        return this.#renderer.canvas;
    }

    set viewTransform(v){
        if(v.constructor.name === Mat3.name){
            this.#viewTransform = v;
        }else return;
    }
    get viewTransform(){
        return this.#viewTransform;
    }

    setViewTransform(v){
        this.viewTransform = v
    }

    getViewTransform(){
        return this.viewTransform;
    }

    getCount(){
        return this.#data.length;
    }

    update(dt){
        this.#data.sort((a, b) => {return a.layer - b.layer});
        this.#data.sort((a, b) => {return a.order - b.order});
        for(let o of this.#data){
            this.#refrash |= o.refrash;
            if(o.refrash)o.render(dt);
        }
    }

    render(dt){
        if(!this.#refrash)return;
        this.#renderer.canvas.width = this.#renderer.canvas.width;
        for(let o of this.#data){
            if(!o.renderer || !o.renderer.canvas)continue;
            let t = Mat3.multiply(this.#viewTransform, o.getRenderTransform()).data;
            let c = o.renderer.canvas;
            let m = o.getModleTransform();
            this.#renderer.save();
            this.#renderer.globalAlpha = o.alpha;
            this.#renderer.imageSmoothingEnabled = !o.pixel;
            this.#renderer.setTransform(t[0], t[3], t[1], t[4], t[2], t[5]);
            this.#renderer.drawImage(c, m[0], m[1])
            this.#renderer.restore();
        }
    }

    add(obj){
        this.#data.push(obj);
    }

    remove(obj){
        let index = this.#data.indexOf(obj)
        if(index != -1){
            this.#data.splice(index, 1);
        }
    }
    clear(){
        this.#data = [];
    }
}

export default CanvasRenderer;