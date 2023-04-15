

export class Color{


    _color;
    constructor(r = 1, g = 1, b = 1, a = 1){
        this._color = new Float32Array(4);

        this.set(r, g, b, a);
    }

    set(r = 1, g = 1, b = 1, a = 1){
        this._color[0] = r;
        this._color[1] = g;
        this._color[2] = b;
        this._color[3] = a;
    }

    get red(){
        return this._color[0];
    }

    get green(){
        return this._color[1];
    }

    get blue(){
        return this._color[2];
    }

    get alpha(){
        return this._color[3];
    }

    get rgba(){
        const [r, g, b, a] = this._color;
        return [r, g, b, a];
    }

    get rgb(){
        const [r, g, b] = this._color;
        return [r, g, b]
    }
}