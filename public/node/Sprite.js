import Node from "./Node.js";
import Vec2 from "../core/vec2.js";
import Color from "../core/color.js";
import BlendFunc from "../core/BlendFunc.js";

class Sprite extends Node{
    #renderer;
    #refrash;
    #color = new Color(255, 255, 255, 255);
    #image = null;
    #pixel = false;

    constructor(img){
        super();
        this.#renderer = document.createElement("canvas").getContext("2d");
        this.#renderer.imageSmoothingEnabled = false;
        this.setImage(img);
    }

    set color(v){
        if(v.constructor.name === Color.name){
            this.#refrash = true;
            this.#color = v;
        }else return;
    }

    get color(){
        return this.#color;
    }

    get size(){
        return new Vec2(this.#renderer.canvas.width, this.#renderer.canvas.height);
    }

    get renderer(){
        return this.#renderer;
    }

    set image(v){
        if(v instanceof Image){
            this.#refrash = true;
            this.#image = v;
            this.#renderer.canvas.width = v.width;
            this.#renderer.canvas.height = v.height;
        }else{
            this.#renderer.canvas.width = 0;
            this.#renderer.canvas.height = 0;
            return;
        }
    }

    set pixel(v){
        if(typeof v == "boolean"){
            this.#pixel = v;
        }
    }

    get pixel(){
        return this.#pixel;
    }

    setColor(v){
        this.color = v;
    }

    getColor(){
        return this.color.clone();
    }

    setImage(img){
        this.image = img;
    }

    getModleTransfrom(){
        return [-this.#renderer.canvas.width * this.anchor.x, -this.#renderer.canvas.height * (1-this.anchor.y)];
    }


    render(){
        if(this.#refrash){
            this.#refrash = false;
            this.#renderer.save();
            this.#renderer.fillStyle = this.color;
            this.#renderer.drawImage(this.#image, 0, 0);
            this.#renderer.globalCompositeOperation = BlendFunc.SRC_ATOP;
            this.#renderer.fillRect(0, 0, this.#renderer.canvas.width, this.#renderer.canvas.height);
            this.#renderer.globalCompositeOperation = BlendFunc.DARKEN;
            this.#renderer.drawImage(this.#image, 0, 0);
            this.#renderer.restore();
        }
    }
}


export default Sprite;