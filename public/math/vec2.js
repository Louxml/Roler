function precision(a){
    var k = 10000000000;
    a *= k;
    a = Math.round(a);
    a /= k;
    return a;
}

class Vec2{
    constructor(x = 0, y = 0){
        this.set(x, y);
    }

    set(x, y){
        this.x = x;
        this.y = y;
        return this;
    }
    setX(x){
        this.x = x;
        return this;
    }
    setY(y){
        this.y = y;
        return this;
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v){
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    
    scale(s){
        this.x *= s;
        this.y *= s;
        return this;
    }

    angle(){
        return Math.atan2(this.y, this.x) * 180 / Math.PI;
    }

    normalize(){
        return this.scale(1/this.length());
    }

    rotate(deg, v = new Vec2()){
        this.sub(v);
        var x = this.x;
        var y = this.y;
        this.x = precision(x * Math.cos(deg*Math.PI/180) - y * Math.sin(deg*Math.PI/180));
        this.y = precision(x * Math.sin(deg*Math.PI/180) + y * Math.cos(deg*Math.PI/180));
        this.add(v);
        return this;
    }

    isZero(){
        return this.x == 0 && this.y == 0;
    }

    isOne(){
        return this.x == 1 && this.y == 1;
    }

    lengthSquared(){
        return this.x ** 2 + this.y ** 2;
    }

    length(){
        return precision(Math.sqrt(this.lengthSquared()));
    }
    
    distance(v){
        return Vec2.getDistance(this, v);
    }

    distanceSquared(v){
        return Vec2.getDistanceSquared(this, v);
    }
    
    clone(){
        return new Vec2(this.x, this.y);
    }
}

Vec2.ZERO = new Vec2();

Vec2.UNIT_X = new Vec2(1, 0);

Vec2.UNIT_Y = new Vec2(0, 1);

Vec2.add = function(a, b){
    return new Vec2(a.x + b.x, a.y + b.y);
}

Vec2.sub = function(a, b){
    return new Vec2(a.x - b.x, a.y - b.y);
}

Vec2.dot = function(a, b){
    return a.x * b.x + a.y * b.y;
}

Vec2.cross = function(a, b){
    return a.x * b.y - a.y * b.x;
}

Vec2.isEqual = function(a, b){
    return Vec2.sub(a, b).lengthSquared() < 0.000000000001;
}

Vec2.scale = function(v, s){
    return v.clone().scale(s);
}

Vec2.rotate = function(v, d){
    return v.clone().rotate(d);
}

Vec2.getNormalize = function(v){
    return v.clone().normalize();
}

Vec2.getAngle = function(a, b){
    return Math.abs(a.angle() - b.angle());
}

Vec2.getDistance = function(a, b){
    return Vec2.sub(a, b).length();
}

Vec2.getDistanceSquared = function(a, b){
    return Vec2.sub(a, b).lengthSquared();
}

Vec2.getMidPoint = function(a, b){
    return new Vec2(a.x + (b.x-a.x)/2, a.y + (b.y-a.y)/2);
}

Vec2.getProject = function(a, b){
    return b.clone().scale(Vec2.dot(a, b)/b.length()**2);
}

export default Vec2;