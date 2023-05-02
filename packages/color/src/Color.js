
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

    /**
     * rgba的颜色分量
     * 值范围[0~1]
     * @Array
     * @private
     */
    _color;

    constructor(...value){
        this._color = new Float32Array(4).fill(1);


        this.normalize(value);
    }

    static HEX_PATTERN = /^(#|0x)?(([a-f0-9]{3}){1,2}|([a-f0-9]{4}){1,2}?)$/i;

    static RGBA_PATTERN = /^(rgb|rgba)\((\d+),(\d+),(\d+)(?:,(\d+))*\)$/i;

    static HSLA_PATTERN = /^(hsl|hsla)\((\d+),(\d*\.?\d+),(\d*\.?\d+)(?:,(\d*\.?\d+))*\)$/i;

    static HSVA_PATTERN = /^(hsv|hsva)\((\d+),(\d*\.?\d+),(\d*\.?\d+)(?:,(\d*\.?\d+))*\)$/i;
    
    

    set(r = 1.0, g = 1.0, b = 1.0, a = 1.0){
        this._color[0] = Math.min(Math.max(r, 0), 1);
        this._color[1] = Math.min(Math.max(g, 0), 1);
        this._color[2] = Math.min(Math.max(b, 0), 1);
        this._color[3] = Math.min(Math.max(a, 0), 1);
    }

    setAlpha(a = 1){
        this._color[3] = Math.min(Math.max(a, 0), 1);
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

        return [Math.round(h), Math.round(s*10000)/100, Math.round(l*10000)/100];
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

        return [Math.round(h), Math.round(s*10000)/100, Math.round(v*10000)/100];
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
        //TODO value 是数组
        const length = value.length;
        const type = typeof value[0];

        if (length === 1){
            value = value[0]
            if (type == 'number'){
                this.setValue(value)
            }else if (type === 'string'){
                value = value.replaceAll(" ","")
                let match;
                if (Color.HEX_PATTERN.exec(value)){
                    this.setHex(value);
                }else if (match = Color.RGBA_PATTERN.exec(value)){
                    this.setRGBA(
                        parseInt(match[2]),
                        parseInt(match[3]),
                        parseInt(match[4]),
                        parseInt(match[5] || 255)
                    );
                }else if (match = Color.HSLA_PATTERN.exec(value)){
                    this.setHSLA(
                        parseInt(match[2]),
                        parseFloat(match[3]),
                        parseFloat(match[4]),
                        parseFloat(match[5] || 100.0)
                    );
                }else if (match = Color.HSVA_PATTERN.exec(value)){
                    this.setHSVA(
                        parseInt(match[2]),
                        parseFloat(match[3]),
                        parseFloat(match[4]),
                        parseFloat(match[5] || 100.0)
                    );
                }
            }else if (type === 'object'){
                if (value.r >=0 && value.g >=0 && value.b >= 0){
                    this.setRGBA(
                        value.r,
                        value.g,
                        value.b,
                        value.a
                    );
                }else if (value.h >= 0 && value.s >= 0 && value.l >= 0){
                    this.setHSLA(
                        value.h,
                        value.s,
                        value.l,
                        value.a
                    );
                }else if (value.h >= 0 && value.s >= 0 && value.v >= 0){
                    this.setHSVA(
                        value.h,
                        value.s,
                        value.v,
                        value.a
                    );
                }
            }
            
        }else if (length >= 3 && length <= 4 && type === 'number'){
            this.set(...value);
        }
    }

    setValue(value = 0xffffff){
        this.set(
            (value >> 16) & 0xFF / 255,
            (value >> 8) & 0xFF / 255,
            value & 0xFF / 255,
        );
    }

    setHex(value = '#ffffff'){
        const match = Color.HEX_PATTERN.exec(value);
        const str = match[2].length <= 4 ? match[2].split('').map(v => v.repeat(2)).join('') : match[2];
        const hex = parseInt(str.slice(0, 6), 16);
        const alpha = parseInt(str.slice(6, 8) || "ff", 16);
        this.set(
            ((hex >> 16) & 0xFF) / 255,
            ((hex >> 8) & 0xFF) / 255,
            (hex & 0xFF) / 255,
            alpha / 255
        );
    }

    setRGBA(r = 255, g = 255, b = 255, a = 255){
        r = Math.max(Math.min(r, 255), 0)
        g = Math.max(Math.min(g, 255), 0)
        b = Math.max(Math.min(b, 255), 0)
        this.set(r/255, g/255, b/255, a/255);
    }

    setRGB(r = 255, g = 255, b = 255){
        this.set(r/255, g/255, b/255);
    }

    setHSLA(h = 0, s = 0, l = 0, a = 100){
        h = h % 360 / 360;
        s = Math.max(Math.min(s, 100), 0) / 100,
        l = Math.max(Math.min(l, 100), 0) / 100;
        a = Math.max(Math.min(a, 100), 0) / 100;
        let r, g, b;

        if(s == 0){
            r = g = b = l; // achromatic
        }else{
            const hue2rgb = (p, q, t) => {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }

            let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            let p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        this.set(r, g, b, a);
    }

    setHSL(h = 0, s = 0, l = 0){
        this.setHSLA(h, s, l);
    }

    setHSVA(h = 0, s = 0, v = 0, a = 100){
        s = Math.max(Math.min(s, 100), 0) / 100;
        v = Math.max(Math.min(v, 100), 0) / 100;
        a = Math.max(Math.min(a, 100), 0) / 100;
        let r, g, b;
        if (s == 0){
            r = g = b = v;
        }else{
            const c = v * s;
            const x = c * (1 - Math.abs((h/60)%2-1));
            const m = v - c;

            const key = [
                [c + m, x + m, m],
                [x + m, c + m, m],
                [m, c + m, x + m],
                [m, x + m, c + m],
                [x + m, m, c + m],
                [c + m, m, x + m]
            ]
            const value = key[h/60|0];
            [r, g, b] = value;
        }

        this.set(r, g, b, a);
    }

    setHSV(h = 0, s = 0, v = 0){
        this.setHSVA(h, s, v);
    }

    toHexString(){
        const k = [0, 1, 2, 3 ,4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
        // const k = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
        const c = this.rgb;
        let res = "#";
        for (let v of c){
            res += k[v >> 4];
            res += k[v & 0xf];
        }
        return res
    }

    toHexAString(){
        const k = [0, 1, 2, 3 ,4, 5, 6, 7, 8, 9, 'a', 'b', 'c', 'd', 'e', 'f'];
        let a = ""
        a += k[this.alpha >> 4];
        a += k[this.alpha & 0xf];
        return this.toHexString() + a;
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