import Mat3 from "../core/mat3.js";
import Vec2 from "../core/vec2.js";
class CanvasRenderer{

    #size = new Vec2(0, 0);
    #refrash = true;
    #renderer;
    #data = [];
    #viewMatrix = Mat3.UNIT;
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

    set viewMatrix(v){
        if(v.constructor.name === Mat3.name){
            this.#viewMatrix = v;
        }else return;
    }
    get viewMatrix(){
        return this.#viewMatrix.clone();
    }

    setViewMatrix(v){
        this.viewMatrix = v
    }

    getViewMatrix(){
        return this.viewMatrix;
    }

    getScreenMat3(){
        return new Mat3([
            1, 0, this.#renderer.canvas.width/2,
            0, 1, -this.#renderer.canvas.height/2,
            0, 0, 1
        ]);
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
            // 模型矩阵
            let t = o.getRenderMat3();
            // 观察矩阵
            t = this.getViewMatrix().multiply(t)
            // 视口矩阵
            t = this.getScreenMat3().multiply(t).data
            let c = o.renderer.canvas;
            let m = o.getVertex();
            this.#renderer.save();
            this.#renderer.globalAlpha = o.alpha;
            this.#renderer.imageSmoothingEnabled = !o.pixel;
            this.#renderer.setTransform(t[0], -t[3], -t[1], t[4], t[2], -t[5]);
            this.#renderer.drawImage(c, m[0], m[1]);
            this.#renderer.restore();
        }
    }

    add(obj){
        this.#data.push(obj);
        // console.log(Mat3.multiply(this.#viewMatrix, obj.getRenderTransform()).data)
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