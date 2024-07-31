

import { EventEmitter } from "../../../../eventemitter/EventEmtter.js";
import { Rectangle } from "../../../../maths/shapes/Rectangle.js";
import { uid } from "../../../../utils/data/uid.js";
import { TextureMatrix } from "./TextureMatrix.js";
import { TextureSource } from "./sources/TextureSource.js";

/** 纹理边距， 常用于九宫格缩放 */
export class TextureBorders{
    left = 0;
    right = 0;
    top = 0;
    bottom = 0;
}

export class TextureUVs{
    x0 = 0;
    y0 = 0;
    x1 = 0;
    y1 = 0;
    x2 = 0;
    y2 = 0;
    x3 = 0;
    y3 = 0;

}


export class Texture extends EventEmitter{

    /** 标签 */
    label;

    #uid;

    /** 是否销毁 */
    destroyed;

    /** textureSource */
    #source;

    /** 无帧模式 */
    noFrame;

    /** 实际渲染区域 */
    frame;

    /** 原始纹理区域，放入图集之前？ */
    orig;
    /** 裁剪纹理区域，放入图集之前？ */
    trim;

    /** 默认锚点 */
    defaultAnchor;

    /** 默认边框。常用于九宫格缩放 */
    defaultBorders;

    /** TODO groupD8？ */
    rotate;

    #textureMatrix;

    /** UVs */
    #uvs;

    constructor({source, label, frame, orig, trim, defaultAnchor, defaultBorders, rotate, dynamic}){
        super();

        this.#uid = uid('texture');

        this.label = label;
        this.source = source?.source ?? new TextureSource();

        this.noFrame = !frame;

        if (frame){
            this.frame = frame.clone();
        } else {
            const { width, height } = this.#source;
            this.frame = new Rectangle(0, 0, width, height);
        }

        this.orig = orig ?? this.frame;
        this.trim = trim;

        this.rotate = rotate ?? 0;
        this.defaultAnchor = defaultAnchor ?? {x:0, y:0};
        this.defaultBorders = defaultBorders ?? new TextureBorders();

        this.#uvs = new TextureUVs();

        this.destroyed = false;
        this.dynamic = dynamic ?? false;

        this.#textureMatrix = new TextureMatrix(this);

        this.updateUvs();
    }


    update(){
        if (this.noFrame){
            const { width, height } = this.#source;
            this.frame.width = width;
            this.frame.height = height;
        }

        this.updateUvs();
        this.emit('update', this);
    }

    updateUvs(){
        const { uvs, frame } = this;
        const { width, height } = this.#source;

        const nx = frame.x / width;
        const ny = frame.y / height;
        const nw = frame.width / width;
        const nh = frame.height / height;

        let rotate = this.rotate;

        if (rotate){
            const w2 = nw / 2;
            const h2 = nh / 2;

            const cx = nx + w2;
            const cy = ny + h2;

            // TODO GroupD8
            throw new Error('TODO GroupD8');
        }else{
            uvs.x0 = nx;
            uvs.y0 = ny;
            uvs.x1 = nx + nw;
            uvs.y1 = ny;
            uvs.x2 = nx + nw;
            uvs.y2 = ny + nh;
            uvs.x3 = nx;
            uvs.y3 = ny + nh;
        }
    }

    destroy(destroySource){
        if (destroySource){
            this.#source?.destroy();
            this.#source = null;
        }

        this.#textureMatrix = null;
        this.destroyed = true;
        this.emit('destroy', this);
        this.clear();
    }

    

    get uid(){
        return this.#uid;
    }
    
    get source(){
        return this.#source;
    }

    set source(value){

        this.#source?.off('resize', this.update, this)
        this.#source = value;
        this.#source?.on('resize', this.update, this)
        // TODO udpate?
        this.emit('update', this);
    }

    get width(){
        return this.orig.width;
    }

    get height(){
        return this.orig.height;
    }

    get textureMatrix(){
        return this.#textureMatrix;
    }

    get uvs(){
        return this.#uvs;
    }


    static EMPTY = new Texture({
        label: 'EMPTY',
        source: new TextureSource({
            label: 'EMPTY',
        })
    });

    static WHITE = new Texture({
        label: 'WHITE',
        source: new TextureSource({
            label: 'WHITE',
        })
    });
}