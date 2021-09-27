import Vec2 from "../core/vec2.js";
class CanvasRenderer{

    #size = new Vec2(0, 0);
    #refrash = true;
    #renderer;
    #data = [];
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

    update(){
        this.#data.sort((a, b) => {return a.layer - b.layer});
        this.#data.sort((a, b) => {return a.order - b.order});
        for(let o of this.#data){
            this.#refrash |= o.refrash;
            if(o.refrash)o.render();
        }
    }

    render(){
        if(!this.#refrash)return;
        this.#renderer.clearRect(0, 0, this.#renderer.canvas.width, this.#renderer.canvas.height);
        for(let o of this.#data){
            if(!o.renderer || !o.renderer.canvas)continue;
            let t = o.getWorldTransfrom().data;
            let c = o.renderer.canvas;
            this.#renderer.save();
            this.#renderer.globalAlpha = o.alpha;
            this.#renderer.imageSmoothingEnabled = !o.pixel;
            this.#renderer.setTransform(t[0], t[3], t[1], t[4], t[2], t[5]);
            this.#renderer.drawImage(c, -c.width * o.anchor.x, -c.height * o.anchor.y)
            this.#renderer.restore();
        }
    }

    add(obj){
        this.#data.push(obj);
    }
}

export default CanvasRenderer;