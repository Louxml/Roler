import Vec2 from "../core/vec2.js";
import BlendFunc from "../core/BlendFunc.js";
class CanvasTexture{
    #size = new Vec2(0, 0);
    #canvas;
    #renderer;
    constructor(w = 0,h = 0){
        this.#canvas = document.createElement("canvas");
        this.#size = new Vec2(w, h);
        this.#renderer = this.canvas.getContext("2d");
    }
    
    set size(v){
        if(v.constructor.name === Vec2.name){
            this.#size = v;
            this.canvas.width = v.x;
            this.canvas.height = v.y;
        }else return;
    }

    get size(){
        return this.#size.clone();
    }

    get canvas(){
        return this.#canvas;
    }

    get renderer(){
        return this.#renderer;
    }

    setBlendFunc(blend){
        let values = Object.values(BlendFunc);
        if(!values.includes(blend))return;
        this.#renderer.globalCompositeOperation = blend;
    }
}

export default CanvasTexture;