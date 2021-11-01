import Vec2 from "./vec2.js";

class Mat3{
    #data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    constructor(data){
        if(data instanceof Array && data.length == 9 && typeof data[0] == "number"){
            this.#data = data;
        }
    }

    get data(){
        return this.#data.map((v)=>v);
    }

    add(m){
        if(m.constructor.name != Mat3.name)return this;
        m = m.data;
        for(let i = 0;i < 9;i++)
            this.#data[i] += m[i];
        return this;
    }

    sub(m){
        if(m.constructor.name != Mat3.name)return this;
        m = m.data;
        for(let i = 0;i < 9;i++)
            this.#data[i] -= m[i];
        return this;
    }

    multiply(m){
        if(m.constructor.name != Mat3.name)return this;
        m = m.data;
        let data = this.#data.map((v)=>v);
        this.#data[0] = data[0] * m[0] + data[1] * m[3] + data[2] * m[6];
        this.#data[1] = data[0] * m[1] + data[1] * m[4] + data[2] * m[7];
        this.#data[2] = data[0] * m[2] + data[1] * m[5] + data[2] * m[8];
        this.#data[3] = data[3] * m[0] + data[4] * m[3] + data[5] * m[6];
        this.#data[4] = data[3] * m[1] + data[4] * m[4] + data[5] * m[7];
        this.#data[5] = data[3] * m[2] + data[4] * m[5] + data[5] * m[8];
        this.#data[6] = data[6] * m[0] + data[7] * m[3] + data[8] * m[6];
        this.#data[7] = data[6] * m[1] + data[7] * m[4] + data[8] * m[7];
        this.#data[8] = data[6] * m[2] + data[7] * m[5] + data[8] * m[8];
        return this;
    }

    isEqual(m){
        if(m.constructor.name != Mat3.name)return this;
        m = m.data;
        for(let i = 0;i < 9;i++){
            if(this.#data[i] != m[i])return false;
        }
        return true;
    }

    isIdentity(){
        return this.isEqual(new Mat3());
    }

    setIdentity(){
        this.#data = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    }

    setZero(){
        this.#data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    
    inversed(){
        [this.#data[1], this.#data[3]] = [this.#data[3], this.#data[1]];
        [this.#data[2], this.#data[6]] = [this.#data[6], this.#data[2]];
        [this.#data[5], this.#data[7]] = [this.#data[7], this.#data[5]];
        return this;
    }

    clone(){
        return new Mat3(this.data);
    }

    static get UNIT(){
        return new Mat3();
    }

    static get ZERO(){
        return new Mat3([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }
    
}

Mat3.add = function(a, b){
    return a.clone().add(b);
}
Mat3.sub = function(a, b){
    return a.clone().sub(b);
}
Mat3.multiply = function(a, b){
    return a.clone().multiply(b);
}
Mat3.isEqual = function(a, b){
    return a.isEqual(b);
}
Mat3.isIdentity = function(a){
    return a.isIdentity();
}
Mat3.getInversed = function(a){
    return a.clone().inversed();
}
Mat3.translate = function(x, y){
    return new Mat3([
        1, 0, x,
        0, 1, y,
        0, 0, 1
    ]);
}
Mat3.rotate = function(deg){
    return new Mat3([
        Math.cos(deg * Math.PI / 180), -Math.sin(deg * Math.PI / 180), 0,
        Math.sin(deg * Math.PI / 180), Math.cos(deg * Math.PI / 180), 0,
        0, 0, 1
    ]);
}
Mat3.scale = function(x, y){
    if(!y)y=x;
    return new Mat3([
        x, 0, 0,
        0, y, 0,
        0, 0, 1
    ]);
}

export default Mat3;