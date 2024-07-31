
import { Mat3 } from "../../../../maths/matrix/Mat3.js";

const tempMat3 = new Mat3();

export class TextureMatrix {

    mapCoord;

    clampOffset;

    clampMargin;

    #uClampFrame;

    #uClampOffset;

    #textureID;

    #updateID;

    #texture;

    isSimple;


    constructor(texture, clampMargin){
        this.mapCoord = new Mat3();

        this.#uClampFrame = new Float32Array(4);
        this.#uClampOffset = new Float32Array(2);

        this.#textureID = -1;
        this.#updateID = 0;

        this.clampOffset = 0;

        if (clampMargin){
            this.clampMargin = clampMargin;
        }
        else {
            this.clampMargin = texture.width < 10 ? 0 : 0.5;
        }

        this.isSimple = false;


        this.texture = texture;
    }

    /**
     * uv乘以uv矩阵
     * @param {Float32Array} uvs uv数据
     * @param {Float32Array} out 输出，没传则修改uvs
     * @returns 
     */
    multiplyUvs(uvs, out){
        out ??= uvs;

        const mat = this.mapCoord;

        for (let i = 0; i < uvs.length; i += 2){
            const x = uvs[i];
            const y = uvs[i + 1];

            out[i] = x * mat[0] + y * mat[1] + mat[2];
            out[i + 1] = x * mat[3] + y * mat[4] + mat[5];
        }

        return out;

    }

    /** 更新矩阵 */
    update(){
        const tex = this.#texture;

        this.#updateID++;
        
        const uvs = tex.uvs;

        // TODO 为什么?
        // this.mapCoord.set([]);

        const orig = tex.orig;
        const trim = tex.trim;

        // 纹理区域裁剪
        // TODO trim是什么
        if (trim){
            tempMat3.set([
                orig.width / trim.width, 0, -trim.x / trim.width,
                0, orig.height / trim.height, -trim.y / trim.height,
                0, 0, 1
            ]);

            this.mapCoord.multiply(tempMat3);
        }

        const texBase = tex.source;
        const frame = this.#uClampFrame;
        const margin = this.clampMargin / texBase.resolution;
        const offset = this.clampOffset;

        frame[0] = (tex.frame.x + margin + offset) / texBase.width;
        frame[1] = (tex.frame.y + margin + offset) / texBase.height;
        frame[2] = (tex.frame.x + tex.frame.width - margin + offset) / texBase.width;
        frame[3] = (tex.frame.y + tex.frame.height - margin + offset) / texBase.height;

        // TODO 为什么
        this.#uClampOffset[0] = offset / texBase.pixelWidth;
        this.#uClampOffset[1] = offset / texBase.pixelHeight;

        this.isSimple = tex.frame.width === texBase.width && tex.frame.height === texBase.height;
        return true;
    }

    get texture(){
        return this.#texture
    }

    set texture(value){
        if (this.#texture === value) return;

        this.#texture?.off('update', this.update, this);
        this.#texture = value;
        this.#texture?.on('update', this.update, this);

        this.update();
    }

    get updateID(){
        return this.#updateID;
    }
}