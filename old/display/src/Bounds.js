import { Rectangle } from "../../math/index.js";

export class Bounds{
    minX;
    minY;
    maxX;
    maxY;
    rect;
    updateID;

    constructor(){
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;

        this.rect = null;
        this.updateID = -1;
    }

    isEmpty(){
        return this.minX > this.maxX || this.minY > this.maxY;
    }

    clear(){
        this.minX = Infinity;
        this.minY = Infinity;
        this.maxX = -Infinity;
        this.maxY = -Infinity;
    }

    getRectangle(rect){
        if (this.isEmpty()){
            return Rectangle.EMPTY;
        }

        rect = rect || new Rectangle(0, 0, 1, 1);

        rect.x = this.minX;
        rect.y = this.minY;
        rect.width = this.maxX - this.minX;
        rect.height = this.maxY - this.maxY;

        return rect;
    }

    addPoint(p){
        this.minX = Math.min(this.minX, p.x);
        this.maxX = Math.max(this.maxX, p.x);
        this.minY = Math.min(this.minY, p.y);
        this.maxY = Math.max(this.maxY, p.y);
    }

    addPointMatrix(m, p){
        const pos = m.apply(p);
        this.addPoint(pos);
    }

    addQuad(vert){
        for(let i = 0;i < 4;i += 2){
            let x = vert[i];
            let y = vert[i + 1];
            this.minX = Math.min(this.minX, x);
            this.maxX = Math.max(this.maxX, x);
            this.minY = Math.min(this.minY, y);
            this.maxY = Math.max(this.maxY, y);
        }
    }

    addFrame(t, x0, y0, x1, y1){
        this.addFrameMatrix(t.worldTransfrom, x0, y0, x1, y1);
    }

    addFrameMatrix(m, x0, y0, x1, y1){
        const a = m.a;
        const b = m.b;
        const c = m.c;
        const d = m.d;
        const tx = m.tx;
        const ty = m.ty;

        let minX = this.minX;
        let minY = this.minY;
        let maxX = this.maxX;
        let maxY = this.maxY;

        let x = (a * x0) + (c * y0) + tx;
        let y = (b * x0) + (d * y0) + ty;

        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x1) + (c * y0) + tx;
        y = (b * x1) + (d * y0) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x0) + (c * y1) + tx;
        y = (b * x0) + (d * y1) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        x = (a * x1) + (c * y1) + tx;
        y = (b * x1) + (d * y1) + ty;
        minX = x < minX ? x : minX;
        minY = y < minY ? y : minY;
        maxX = x > maxX ? x : maxX;
        maxY = y > maxY ? y : maxY;

        this.minX = minX;
        this.minY = minY;
        this.maxX = maxX;
        this.maxY = maxY;
    }

    addVertexData(vert, begin, end){
        for(let i = begin;i < end;i+=2){
            let x = vert[i];
            let y = vert[i + 1];
            this.minX = Math.min(this.minX, x);
            this.maxX = Math.max(this.maxX, x);
            this.minY = Math.min(this.minY, y);
            this.maxY = Math.max(this.maxY, y);
        }
    }

    addVertices(t, vert, begin, end){
        this.addVerticesMatrix(t.worldTransfrom, vert, begin, end);
    }

    addVerticesMatrix(m, vert, begin, end, padX = 0, padY = padX){
        for (let i = begin; i < end; i += 2){
            const rawX = vert[i];
            const rawY = vert[i + 1];
            const x = (m.a * rawX) + (m.c * rawY) + tx;
            const y = (m.b * rawX) + (m.d * rawY) + ty;

            this.minX = Math.min(this.minX, x - padX);
            this.maxX = Math.max(this.maxX, x + padX);
            this.minY = Math.min(this.minY, y - padY);
            this.maxY = Math.max(this.maxY, y + padY);
        }
    }

    addBounds(b){
        this.minX = Math.min(this.minX, b.minX);
        this.maxX = Math.max(this.maxX, b.maxX);
        this.minY = Math.min(this.minY, b.minY);
        this.maxY = Math.max(this.maxY, b.maxY);
    }

    addBoundsMask(b, mask){
        const minX = Math.max(b.minX, mask.minX);
        const minY = Math.max(b.minY, mask.minY);
        const maxX = Math.min(b.maxX, mask.maxX);
        const maxY = Math.min(b.maxY, mask.maxY);

        if (minX <= maxX && minY <= maxY){
            this.minX = Math.min(this.minX, minX);
            this.maxX = Math.max(this.maxX, maxX);
            this.minY = Math.min(this.minY, minY);
            this.maxY = Math.max(this.maxY, maxY);
        }
    }

    addBoundsMatrix(b, m){
        this.addFrameMatrix(m, b.minX, b.minY, b.maxX, b.maxY);
    }

    addBoundsArea(b, area){
        const minX = Math.max(b.minX, area.x);
        const minY = Math.max(b.minY, area.y);
        const maxX = Math.min(b.maxX, area.x + area.width);
        const maxY = Math.min(b.maxY, area.y + area.height);

        if (minX <= maxX && minY <= maxY){
            this.minX = Math.min(this.minX, minX);
            this.maxX = Math.max(this.maxX, maxX);
            this.minY = Math.min(this.minY, minY);
            this.maxY = Math.max(this.maxY, maxY);
        }
    }

    pad(padX, padY = padX){
        if (!this.isEmpty()){
            this.minX -= padX;
            this.maxX += padX;
            this.minY -= padY;
            this.maxY += padY;
        }
    }

    addFramePad(x0, y0, x1, y1, padX, padY){
        x0 -= padX;
        y0 -= padY;
        x1 += padX;
        y1 += padY;
        this.minX = Math.min(this.minX, x0);
        this.maxX = Math.max(this.maxX, x1);
        this.minY = Math.min(this.minY, y0);
        this.maxY = Math.max(this.maxY, y1);
    }
}