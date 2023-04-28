
/**
 * 0xffffff
 * 0xffffffff
 * "#fff"
 * "#ffff"
 * "#ffffff"
 * "#ffffffff"
 * "rgb(255, 255, 255)"
 * "rgba(255, 255, 255, 255)"
 * "hsl(360, 100%, 100%)"
 * "hsv(360, 80%, 100%)"
 */

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
        return Math.round(this._color[0] * 255);
    }

    get green(){
        return Math.round(this._color[1] * 255);
    }

    get blue(){
        return Math.round(this._color[2] * 255);
    }

    get alpha(){
        return Math.round(this._color[3] * 255);
    }

    get rgba(){
        return [this.red, this.green, this.blue, this.alpha];
    }

    get rgb(){
        return [this.red, this.green, this.blue];
    }

    get hsl(){
        const c = this._color.slice(0, 3);
        const cmax = Math.max(...c);
        const cmin = Math.min(...c);
        const mIdx = c.indexOf(cmax);
        const d = cmax - cmin;
        
        let h = 0;
        if (d == 0){
            h = 0;
        }else if (mIdx == 0){
            h = 60 * (((c[1] - c[2])/d)%6);
        }else if (mIdx == 1){
            h = 60 * ((c[2] - c[0])/d + 2);
        }else if (mIdx == 2){
            h = 60 * ((c[0] - c[1])/d + 4);
        }

        let l = (cmax + cmin) / 2;

        let s = 0;
        if (d == 0){
            s = 0;
        }else{
            s = d / (1 - Math.abs(2*l - 1));
        }

        return [Math.round(h*100)/100, Math.round(s*10000)/100, Math.round(l*10000)/100];
    }

    get hsla(){
        const d = this.hsl;
        d[3] = Math.round(this._color[3] * 10000) / 100;
        return d;
    }

    get hsv(){
        const c = this._color.slice(0, 3);
        const cmax = Math.max(...c);
        const cmin = Math.min(...c);
        const mIdx = c.indexOf(cmax);
        const d = cmax - cmin;
        
        let h = 0;
        if (d == 0){
            h = 0;
        }else if (mIdx == 0){
            h = 60 * (((c[1] - c[2])/d)%6);
        }else if (mIdx == 1){
            h = 60 * ((c[2] - c[0])/d + 2);
        }else if (mIdx == 2){
            h = 60 * ((c[0] - c[1])/d + 4);
        }

        let s = 0;
        if (cmax == 0){
            s = 0;
        }else{
            s = d / cmax;
        }
        
        let v = cmax;

        return [Math.round(h*100)/100, Math.round(s*10000)/100, Math.round(v*10000)/100];
    }

    get hsva(){
        const d = this.hsv;
        d[3] = Math.round(this._color[3] * 10000) / 100;
        return d;
    }

    get value(){
        const c = this.rgb;
        let value = 0;
        for (let i in c){
            value += Math.round(c[i]*255) * Math.pow(16, (2-i)*2);
        }

        return value;
    }

    normalize(value){

    }


    toHexString(){
        // const k = [0, 1, 2, 3 ,4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
        const k = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
        const c = this.rgb;
        let res = "#";
        for (let v of c){
            res += k[v >> 4];
            res += k[v & 0xf];
        }
        return res
    }

    toHSLString(){
        return `hsl(${this.hsl[0]}, ${this.hsl[1]}, ${this.hsl[2]})`;
    }

    toHSLAString(){
        return `hsla(${this.hsla[0]}, ${this.hsla[1]}, ${this.hsla[2]}, ${this.hsla[3]})`;
    }

    toHSVString(){
        return `hsv(${this.hsv[0]}, ${this.hsv[1]}, ${this.hsv[2]})`;
    }

    toHSVAString(){
        return `hsva(${this.hsva[0]}, ${this.hsva[1]}, ${this.hsva[2]}, ${this.hsva[3]})`;
    }
}