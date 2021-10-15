import Node from "./Node.js";
import Mat3 from "../core/mat3.js";
import Color from "../core/color.js";
import Vec2 from "../core/vec2.js";
import BlendFunc from "../core/BlendFunc.js";



class Particles extends Node{

    static TYPE = { WORLD:0, LOCAL:1 };
    static TARGET = { POINT:0, CIRCLE:1, RECT:2, CIRCLEBORDER:3, RECTBORDER:4 };
    static SIZE = new Vec2(40, 40);

    #target;
    #state = 0;

    // 粒子列表
    #data = [];
    // 位置定位
    #type = Particles.TYPE.WORLD;
    // 粒子最大数
    #total = 1000;
    // 时长（-1为永久）
    #duration = -1;
    // 已持续时长
    #time = 0;
    // 粒子生命周期(ms)
    #life = 1000;
    // 生命周期浮动值
    #lifeCycle = 0;
    // 粒子发射速率（每秒粒子数）
    #emission = 100;
    // 已经发射次数
    #emitTimes = 0;
    // 发射角度
    #angular = 90;
    // 角度浮动值
    #angularCycle = 0;

    // 起始状态
    // 大小
    #startSize = 40;
    #startSizeCycle = 0;
    // 旋转
    #startSpin = 0;
    #startSpinCycle = 0;
    // 颜色
    #startColor = new Color(255, 255, 255, 255);
    #startColorCycle = new Color(0, 0, 0, 0);

    // 终止状态
    // 大小
    #endSize = 0;
    #endSizeCycle = 0;
    // 旋转
    #endSpin = 0;
    #endSpinCycle = 0;
    // 颜色
    #endColor = new Color(255, 255, 255, 0);
    #endColorCycle = new Color(0, 0, 0, 0);
    // 混合模式
	#renderBlend = BlendFunc.SRC_IN;
    #assetBlend = BlendFunc.SRC_IN;

    #renderer;

    constructor(target = 0){
        super()
        this.#renderer = document.createElement("canvas").getContext("2d");
        this.#renderer.canvas.width = window.innerWidth;
        this.#renderer.canvas.height = window.innerHeight;
        this.#target = document.createElement("canvas").getContext("2d");
        this.#target.canvas.width = Particles.SIZE.w;
        this.#target.canvas.height = Particles.SIZE.h;
        this.setTargetType(target);
        this.setRenderBlendFunc(BlendFunc.LIGHTER);
    }

    set target(v){
        if(v.constructor.name == CanvasRenderingContext2D.name){
            this.#target.clearRect(0, 0, this.#target.canvas.width, this.#target.canvas.height)
            this.#target.drawImage(v.canvas, 0, 0, Particles.SIZE.w, Particles.SIZE.h);
        }else if(v instanceof Image){
            this.#target.clearRect(0, 0, this.#target.canvas.width, this.#target.canvas.height)
            this.#target.drawImage(v, 0, 0, Particles.SIZE.w, Particles.SIZE.h);
        }else return;
    }
    
    get target(){
        return this.#target;
    }
    
    get renderer(){
        return this.#renderer;
    }

    set type(v){
        if(typeof v == "number"){
            this.#type = v;
        }else return;
    }

    get type(){
        return this.#type;
    }

    set total(v){
        if(typeof v == "number"){
            this.#total = v;
        }else return;
    }

    get total(){
        return this.#total;
    }

    set duration(v){
        if(typeof v == "number"){
            this.#duration = v;
            this.#time = 0;
		    this.#emitTimes = 0;
        }else return;
    }

    get duration(){
        return this.#duration;
    }

    set life(v){
        if(typeof v == "number"){
            this.#life = v;
        }else return;
    }
    get life(){
        return this.#life;
    }

    set lifeCycle(v){
        if(typeof v == "number"){
            this.#lifeCycle = v;
        }else return;
    }
    get lifeCycle(){
        return this.#lifeCycle;
    }

    set emission(v){
        if(typeof v == "number"){
            this.#emission = v;
        }else return;
    }
    get emission(){
        return this.#emission;
    }

    set angular(v){
        if(typeof v == "number"){
            this.#angular = v;
        }else return;
    }
    get angular(){
        return this.#angular;
    }

    set angularCycle(v){
        if(typeof v == "number"){
            this.#angularCycle = v;
        }else return;
    }
    get angularCycle(){
        return this.#angularCycle;
    }

    set startSize(v){
        if(typeof v == "number"){
            this.#startSize = v;
        }else return;
    }
    get startSize(){
        return this.#startSize;
    }

    set startSizeCycle(v){
        if(typeof v == "number"){
            this.#startSizeCycle = v;
        }else return;
    }
    get startSizeCycle(){
        return this.#startSizeCycle;
    }

    set startSpin(v){
        if(typeof v == "number"){
            this.#startSpin = v;
        }else return;
    }
    get startSpin(){
        return this.#startSpin;
    }

    set startSpinCycle(v){
        if(typeof v == "number"){
            this.#startSpinCycle = v;
        }else return;
    }
    get startSpinCycle(){
        return this.#startSpinCycle;
    }

    set startColor(v){
        if(v.constructor.name === Color.name){
            this.#startColor = v;
        }else return;
    }
    get startColor(){
        return this.#startColor;
    }

    set startColorCycle(v){
        if(v.constructor.name === Color.name){
            this.#startColorCycle = v;
        }else return;
    }
    get startColorCycle(){
        return this.#startColorCycle;
    }

    set endSize(v){
        if(typeof v == "number"){
            this.#endSize = v;
        }else return;
    }
    get endSize(){
        return this.#endSize;
    }

    set endSizeCycle(v){
        if(typeof v == "number"){
            this.#endSizeCycle = v;
        }else return;
    }
    get endSizeCycle(){
        return this.#endSizeCycle;
    }

    set endSpin(v){
        if(typeof v == "number"){
            this.#endSpin = v;
        }else return;
    }
    get endSpin(){
        return this.#endSpin;
    }

    set endSpinCycle(v){
        if(typeof v == "number"){
            this.#endSpinCycle = v;
        }else return;
    }
    get endSpinCycle(){
        return this.#endSpinCycle;
    }

    set endColor(v){
        if(v.constructor.name === Color.name){
            this.#endColor = v;
        }else return;
    }
    get endColor(){
        return this.#endColor;
    }

    set endColorCycle(v){
        if(v.constructor.name === Color.name){
            this.#endColorCycle = v;
        }else return;
    }
    get endColorCycle(){
        return this.#endColorCycle;
    }


    getCount(){
		return this.#data.length;
	}
    
    setTarget(v){
        this.target = v;
    }
    getTarget(){
        return this.target;
    }

	setTargetType(target){
        switch(target){
            case Particles.TARGET.POINT:
                this.#target.clearRect(0, 0, this.#target.canvas.width, this.#target.canvas.height);
                this.#target.save();
                this.#target.translate(this.#target.canvas.width/2,this.#target.canvas.height/2);
                let grd = this.#target.createRadialGradient(0,0,0,0,0,this.#target.canvas.width/2-4);
                grd.addColorStop(0,"rgba(255,255,255,1)");
                grd.addColorStop(1,"rgba(255,255,255,0)");
                this.#target.fillStyle = grd;
                this.#target.arc(0,0,this.#target.canvas.width/2-2,0,2 * Math.PI);
                this.#target.fill();
                this.#target.restore();
            break;
            case Particles.TARGET.CIRCLE:
                this.#target.clearRect(0, 0, this.#target.canvas.width, this.#target.canvas.height);
                this.#target.save();
                this.#target.translate(this.#target.canvas.width/2,this.#target.canvas.height/2);
                this.#target.fillStyle = "#ffffff";
                this.#target.arc(0,0,this.#target.canvas.width/2-4,0,2 * Math.PI);
                this.#target.fill();
                this.#target.restore();
            break;
            case Particles.TARGET.RECT:
                this.#target.clearRect(0, 0, this.#target.canvas.width, this.#target.canvas.height);
                this.#target.save();
                this.#target.fillStyle = "#ffffff";
                this.#target.fillRect(0,0,this.#target.canvas.width,this.#target.canvas.height);
                this.#target.restore();
            break;
            case Particles.TARGET.CIRCLEBORDER:
                this.#target.clearRect(0, 0, this.#target.canvas.width, this.#target.canvas.height);
                this.#target.save();
                this.#target.translate(this.#target.canvas.width/2,this.#target.canvas.height/2);
                this.#target.strokeStyle = "#ffffff";
                this.#target.lineWidth = 2;
                this.#target.arc(0,0,this.#target.canvas.width/2-4,0,2 * Math.PI);
                this.#target.stroke();
                this.#target.restore();
            break;
            case Particles.TARGET.RECTBORDER:
                this.#target.clearRect(0, 0, this.#target.canvas.width, this.#target.canvas.height);
                this.#target.save();
                this.#target.strokeStyle = "#ffffff";
                this.#target.lineWidth = 2;
                this.#target.strokeRect(1, 1, this.#target.canvas.width-2, this.#target.canvas.height-2);
                this.#target.restore();
            break;
        }
	}

    setType(p){
        this.type = p;
    }
    getType(p){
        return this.type;
    }

	setTotal(v){
		this.total = v;
	}
	getTotal(){
		return this.total;
	}

	setDuration(v){
		this.duration = v;
	}
	getDuration(){
		return this.duration;
	}

	setLife(v){
		this.life = v;
	}
	getLife(){
		return this.life;
	}

	setLifeCycle(v){
		this.lifeCycle = v;
	}
	getLifeCycle(){
		return this.lifeCycle;
	}

	setEmission(v){
		this.emission = v;
	}
	getEmission(){
		return this.emission;
	}

	setAngular(v){
		this.angular = v;
	}
	getAngular(){
		return this.angular;
	}

	setAngularCycle(v){
		this.angularCycle = v;
	}
	getAngularCycle(){
		return this.angularCycle;
	}

    setStartSize(v){
        this.startSize = v;
    }
    getStartSize(){
        return this.startSize;
    }

    setStartSizeCycle(v){
        this.startSizeCycle = v;
    }
    getStartSizeCycle(){
        return this.startSizeCycle;
    }

    setStartSpin(v){
        this.startSpin = v;
    }
    getStartSpin(){
        return this.startSpin;
    }

    setStartSpinCycle(v){
        this.startSpinCycle = v;
    }
    getStartSpinCycle(){
        return this.startSpinCycle;
    }

    setStartColor(v){
        this.startColor = v;
    }
    getStartColor(){
        return this.startColor;
    }

    setStartColorCycle(v){
        this.startColorCycle = v;
    }
    getStartColorCycle(){
        return this.startColorCycle;
    }

    setEndSize(v){
        this.endSize = v;
    }
    getEndSize(){
        return this.endSize;
    }

    setEndSizeCycle(v){
        this.endSizeCycle = v;
    }
    getEndSizeCycle(){
        return this.endSizeCycle;
    }

    setEndSpin(v){
        this.endSpin = v;
    }
    getEndSpin(){
        return this.endSpin;
    }

    setEndSpinCycle(v){
        this.endSpinCycle = v;
    }
    getEndSpinCycle(){
        return this.endSpinCycle;
    }

    setEndColor(v){
        this.endColor = v;
    }
    getEndColor(){
        return this.endColor;
    }

    setEndColorCycle(v){
        this.endColorCycle = v;
    }
    getEndColorCycle(){
        return this.endColorCycle;
    }

    setRenderBlendFunc(v){
        this.#renderBlend = v;
        this.#renderer.globalCompositeOperation = v;
    }

    setAssetBlendFunc(v){
        this.#assetBlend = v;
    }

    getRenderTransfrom(){
        return Mat3.UNIT;
    }

    play(){
		this.#state = 1;
    }

    pause(){
        this.#state = 2;
    }

    stop(){
        this.#state = 0;
		this.#time = 0;
		this.#emitTimes = 0;
	}

    create(){
        let life = Math.floor(Math.random() * (2*this.lifeCycle + 1)) + this.life - this.lifeCycle;
        let renderer = document.createElement("canvas").getContext("2d");
        renderer.canvas.width = Particles.SIZE.w
        renderer.canvas.height = Particles.SIZE.h
        renderer.drawImage(this.#target.canvas, 0, 0)
        renderer.globalCompositeOperation = this.#assetBlend;
        return {
            state: 0,
            x: 0,y: 0,
            size:0,
            spin:0,
            refrash:true,
            parent: this.type == Particles.TYPE.WORLD ? null : this,
            transform: this.getWorldTransfrom(),
            life: life,
            totalLife: life,
            angular: Math.floor(Math.random() * (2* this.angularCycle + 1)) + this.angular - this.angularCycle,
            color:new Color(255, 255, 255, 255),
            startSize: Math.floor(Math.random() * (2*this.startSizeCycle + 1)) + this.startSize - this.startSizeCycle,
            startSpin: Math.floor(Math.random() * (2*this.startSpinCycle + 1)) + this.startSpin - this.startSpinCycle,
            startColor: new Color(
                Math.floor(Math.random() * (2*this.startColorCycle.r + 1)) + this.startColor.r - this.startColorCycle.r,
                Math.floor(Math.random() * (2*this.startColorCycle.g + 1)) + this.startColor.g - this.startColorCycle.g,
                Math.floor(Math.random() * (2*this.startColorCycle.b + 1)) + this.startColor.b - this.startColorCycle.b,
                Math.floor(Math.random() * (2*this.startColorCycle.a + 1)) + this.startColor.a - this.startColorCycle.a
            ),
            endSize: Math.floor(Math.random() * (2*this.endSizeCycle + 1)) + this.endSize - this.endSizeCycle,
            endSpin: Math.floor(Math.random() * (2*this.endSpinCycle + 1)) + this.endSpin - this.endSpinCycle,
            endColor: new Color(
                Math.floor(Math.random() * (2*this.endColorCycle.r + 1)) + this.endColor.r - this.endColorCycle.r,
                Math.floor(Math.random() * (2*this.endColorCycle.g + 1)) + this.endColor.g - this.endColorCycle.g,
                Math.floor(Math.random() * (2*this.endColorCycle.b + 1)) + this.endColor.b - this.endColorCycle.b,
                Math.floor(Math.random() * (2*this.endColorCycle.a + 1)) + this.endColor.a - this.endColorCycle.a
            ),
            renderer:renderer,
            update(dt){},
            render(){
                if(this.refrash){
                    this.refrash = false;
                    this.renderer.save()
                    this.renderer.fillStyle = this.color.toString(3);
                    this.renderer.fillRect(0, 0, this.renderer.canvas.width, this.renderer.canvas.height);
                    this.renderer.restore()
                }
            },
            getTransfrom(){
                return new Mat3([
                    Math.cos(this.spin * Math.PI / 180) * (this.size / Particles.SIZE.w), Math.sin(this.spin * Math.PI / 180) * (this.size / Particles.SIZE.h), this.x,
                    -Math.sin(this.spin * Math.PI / 180) * (this.size / Particles.SIZE.w), Math.cos(this.spin * Math.PI / 180) * (this.size / Particles.SIZE.h), -this.y,
                    0, 0, 1
                ]);
            }
        }
    }

    emit(){
        if(this.#data.length < this.total){
            let p = this.create();
            this.#data.push(p);
        }
        this.#emitTimes++;
    }

    #update(dt){
        dt = dt | 0;
        if(this.#state == 1){
            if(this.duration == -1 || this.#time < this.duration){
                while(this.#time * this.emission / 1000 >= this.#emitTimes)this.emit();
                this.#time += dt;
            }else{
                this.stop();
            }
        }

        if(this.#state != 2){
            for(let i = 0;i < this.#data.length;i++){
                if(this.#data[i].life <= 0){
                    this.#data.splice(i--, 1);
                    continue;
                }
                let p = this.#data[i];
                p.size = (p.endSize - p.startSize) * (1 - p.life / p.totalLife) + p.startSize;
                p.spin = (p.endSpin - p.startSpin) * (1 - p.life / p.totalLife) + p.startSpin;
                let oldColor = p.color.toString(3);
                p.color.r = (p.endColor.r - p.startColor.r) * (1 - p.life / p.totalLife) + p.startColor.r;
                p.color.g = (p.endColor.g - p.startColor.g) * (1 - p.life / p.totalLife) + p.startColor.g;
                p.color.b = (p.endColor.b - p.startColor.b) * (1 - p.life / p.totalLife) + p.startColor.b;
                p.color.a = (p.endColor.a - p.startColor.a) * (1 - p.life / p.totalLife) + p.startColor.a;
                if(p.color.toString(3) != oldColor)p.refrash = true;
                p.update(dt);
                p.render(dt);
                p.life -= dt;
            }
        }
    }

    #render(dt){
        this.#renderer.clearRect(0, 0, this.#renderer.canvas.width, this.#renderer.canvas.height);
        for(let o of this.#data){
            let t;
            if(o.parent)t = Mat3.multiply(o.parent.getWorldTransfrom(), o.getTransfrom()).data;
            else t = Mat3.multiply(o.transform, o.getTransfrom()).data;
            this.#renderer.save();
            this.#renderer.setTransform(t[0], t[3], t[1], t[4], t[2], t[5]);
            this.#renderer.globalAlpha = o.color.a/255;
            this.#renderer.drawImage(o.renderer.canvas, -Particles.SIZE.w/2, -Particles.SIZE.h/2);
            this.#renderer.restore();
        }
    }

    render(dt){
        this.#update(dt);
        this.#render(dt);
    }
}

class GravityParticles extends Particles{
    #speed = 0
    #speedCycle = 0
    #area = new Vec2(0, 0)
    #gravity = new Vec2(0, 0)
    #accelRad = 0;
    #accelRadCycle = 0;
    #accelTan = 0;
    #accelTanCycle = 0
    constructor(target = 0){
        super(target)
    }

    set speed(v){
        if(typeof v == "number"){
            this.#speed = v;
        }else return;
    }
    get speed(){
        return this.#speed;
    }

    set speedCycle(v){
        if(typeof v == "number"){
            this.#speedCycle = v;
        }else return;
    }
    get speedCycle(){
        return this.#speedCycle;
    }

    set area(v){
        if(v.constructor.name === Vec2.name){
            this.#area = v;
        }else return;
    }
    get area(){
        return this.#area;
    }

    set gravity(v){
        if(v.constructor.name === Vec2.name){
            this.#gravity = v;
        }else return;
    }
    get gravity(){
        return this.#gravity;
    }

    set accelRad(v){
        if(typeof v == "number"){
            this.#accelRad = v;
        }else return;
    }
    get accelRad(){
        return this.#accelRad;
    }

    set accelRadCycle(v){
        if(typeof v == "number"){
            this.#accelRadCycle = v;
        }else return;
    }
    get accelRadCycle(){
        return this.#accelRadCycle;
    }

    set accelTan(v){
        if(typeof v == "number"){
            this.#accelTan = v;
        }else return;
    }
    get accelTan(){
        return this.#accelTan;
    }

    set accelTanCycle(v){
        if(typeof v == "number"){
            this.#accelTanCycle = v;
        }else return;
    }
    get accelTanCycle(){
        return this.#accelTanCycle;
    }

    setSpeed(v){
        this.speed = v;
    }
    getSpeed(){
        return this.speed;
    }

    setSpeedCycle(v){
        this.speedCycle = v;
    }
    getSpeedCycle(){
        return this.speedCycle;
    }

    setArea(v){
        this.area = v;
    }
    getArea(v){
        return this.area;
    }

    setGravity(v){
        this.gravity = v;
    }
    getGravity(v){
        return this.gravity;
    }

    setAccelRad(v){
        this.accelRad = v;
    }
    getAccelRad(){
        return this.accelRad;
    }

    setAccelRadCycle(v){
        this.accelRadCycle = v;
    }
    getAccelRadCycle(){
        return this.accelRadCycle;
    }

    setAccelTan(v){
        this.accelTan = v;
    }
    getAccelTan(){
        return this.accelTan;
    }

    setAccelTanCycle(v){
        this.accelTanCycle = v;
    }
    getAccelTanCycle(){
        return this.accelTanCycle;
    }

    create(){
        let p = super.create()
        p.x = Math.floor((Math.random() - 0.5) * (this.area.w));
        p.y = Math.floor((Math.random() - 0.5) * (this.area.h));
        p.speed = Math.floor(Math.random() * (2*this.speedCycle + 1)) + this.speed - this.speedCycle;
        p.gravity = this.gravity;
        p.accelRad = Math.floor(Math.random() * (2*this.accelRadCycle + 1)) + this.accelRad - this.accelRadCycle;
        p.accelTan = Math.floor(Math.random() * (2*this.accelTanCycle + 1)) + this.accelTan - this.accelTanCycle;
        p.update = function(dt){
            if(this.life == this.totalLife)dt = 0;
            let nx = this.x ? this.x / Math.hypot(this.x, this.y) : 0;
            let ny = this.y ? this.y / Math.hypot(this.x, this.y) : 0;
            let rx = nx * this.accelRad;
            let ry = ny * this.accelRad;
            let tx = ny * this.accelTan;
            let ty = nx * this.accelTan;
            let gx = this.gravity.x;
            let gy = this.gravity.y;
            let ax = rx + tx + gx;
            let ay = ry + ty + gy;
            ax *= (this.totalLife - this.life) / 1000;
            ay *= (this.totalLife - this.life) / 1000;
            let x = Math.cos(this.angular * Math.PI/180) * this.speed + ax;
            let y = Math.sin(this.angular * Math.PI/180) * this.speed + ay;
            x *= dt / 1000;
            y *= dt / 1000;
            x = (x*100|0)/100;
            y = (y*100|0)/100;
            this.x += x;
			this.y += y;
        }.bind(p)
        return p;
    }
}

class RadiusParticles extends Particles{
    #startRadius = 0;
    #startRadiusCycle = 0;
    #endRadius = 0;
    #accelTan = 0;
    #accelTanCycle = 0;
    constructor(target = 0){
        super(target)
    }

    set startRadius(v){
        if(typeof v == "number"){
            this.#startRadius = v;
        }else return;
    }
    get startRadius(){
        return this.#startRadius;
    }

    set startRadiusCycle(v){
        if(typeof v == "number"){
            this.#startRadiusCycle = v;
        }else return;
    }
    get startRadiusCycle(){
        return this.#startRadiusCycle;
    }

    set endRadius(v){
        if(typeof v == "number"){
            this.#endRadius = v;
        }else return;
    }
    get endRadius(){
        return this.#endRadius;
    }

    set accelTan(v){
        if(typeof v == "number"){
            this.#accelTan = v;
        }else return;
    }
    get accelTan(){
        return this.#accelTan;
    }

    set accelTanCycle(v){
        if(typeof v == "number"){
            this.#accelTanCycle = v;
        }else return;
    }
    get accelTanCycle(){
        return this.#accelTanCycle;
    }

    setStartRadius(v){
        this.startRadius = v;
    }
    getStartRadius(){
        return this.startRadius;
    }

    setStartRadiusCycle(v){
        this.startRadiusCycle = v;
    }
    getStartRadiusCycle(){
        return this.startRadiusCycle;
    }

    setEndRadius(v){
        this.endRadius = v;
    }
    getEndRadius(){
        return this.endRadius;
    }

    setAccelTan(v){
        this.accelTan = v;
    }
    getAccelTan(){
        return this.accelTan;
    }

    setAccelTanCycle(v){
        this.accelTanCycle = v;
    }
    getAccelTanCycle(){
        return this.accelTanCycle;
    }

    create(){
        let p = super.create();
        p.startRadius = Math.floor(Math.random() * (2*this.startRadiusCycle + 1)) + this.startRadius - this.startRadiusCycle;
        p.endRadius = this.endRadius;
        p.accelTan = Math.floor(Math.random() * (2*this.accelTanCycle + 1)) + this.accelTan - this.accelTanCycle;
        p.x = Math.cos(p.angular * Math.PI/180) * p.startRadius;
        p.y = Math.sin(p.angular * Math.PI/180) * p.startRadius;
        p.update = function(dt){
            let radius = (this.startRadius - this.endRadius) * this.life/this.totalLife + this.endRadius;
            let angle = this.angular + this.accelTan * (this.totalLife - this.life)/this.totalLife;
            this.x = Math.cos(angle * Math.PI/180) * radius;
            this.y = Math.sin(angle * Math.PI/180) * radius;
        }.bind(p)
        return p;
    }

}
export{
    GravityParticles,
    RadiusParticles
};