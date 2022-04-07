export class Point{
    x = 0;
    y = 0;

    constructor(x = 0, y = 0){
        this.x = x;
        this.y = y;
    }

    set(x = 0, y = x){
        this.x = x;
        this.y = y;
        return this;
    }

    clone(){
        return new Point(this.x, this.y);
    }

    copyFrom(p){
        return this.set(p.x, p.y);
    }

    copyTo(p){
        return p.set(this.x, this.y);
    }

    equals(p){
        return this.x === p.x && this.y === p.y;
    }

    toString(){
        return `[@Role:Point x=${this.x} y=${this.y}]`;
    }
}