class Color{
    #r = 0;
    #g = 0;
    #b = 0;
    #a = 0;
    constructor(r = 0, g = 0, b = 0, a = 255){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    set r(v){
        if(typeof v == "number" && v >= 0 && v <= 255){
            this.#r = v;
        }else return;
    }
    
    get r(){
        return this.#r;
    }

    set g(v){
        if(typeof v == "number" && v >= 0 && v <= 255){
            this.#g = v;
        }else return;
    }
    
    get g(){
        return this.#g;
    }

    set b(v){
        if(typeof v == "number" && v >= 0 && v <= 255){
            this.#b = v;
        }else return;
    }
    
    get b(){
        return this.#b;
    }

    set a(v){
        if(typeof v == "number" && v >= 0 && v <= 255){
            this.#a = v;
        }else return;
    }
    
    get a(){
        return this.#a;
    }

    set(r, g, b, a){
        this.r = r;
        this.g = g;
        this.b = b;
        this.a = a;
    }

    toString(){
        return `#${(this.#r * (256 ** 3) + this.#g * (256 ** 2) + this.#b * 256 + this.#a).toString(16)}`;
    }

    clone(){
        return new Color(this.#r, this.#g, this.#b, this.#a);
    }

    static get ZERO(){
        return new Color(0, 0, 0, 0);
    }
}

export default Color;