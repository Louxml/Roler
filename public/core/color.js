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
        if(typeof v == "number"){
            if(v < 0)v = 0;
            else if(v > 255)v = 255;
            this.#r = v | 0;
        }else return;
    }
    
    get r(){
        return this.#r;
    }

    set g(v){
        if(typeof v == "number"){
            if(v < 0)v = 0;
            else if(v > 255)v = 255;
            this.#g = v | 0;
        }else return;
    }
    
    get g(){
        return this.#g;
    }

    set b(v){
        if(typeof v == "number"){
            if(v < 0)v = 0;
            else if(v > 255)v = 255;
            this.#b = v | 0;
        }else return;
    }
    
    get b(){
        return this.#b;
    }

    set a(v){
        if(typeof v == "number"){
            if(v < 0)v = 0;
            else if(v > 255)v = 255;
            this.#a = v | 0;
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

    toString(n=4){
        let s = `#${(0+this.#r.toString(16)).slice(-2)}${(0+this.#g.toString(16)).slice(-2)}${(0+this.#b.toString(16)).slice(-2)}${(0+this.#a.toString(16)).slice(-2)}`;
        return s.substring(0, 2*n+1);
    }

    clone(){
        return new Color(this.#r, this.#g, this.#b, this.#a);
    }

    static get ZERO(){
        return new Color(0, 0, 0, 0);
    }
}

export default Color;