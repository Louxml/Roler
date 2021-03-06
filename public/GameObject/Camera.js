class Camera extends Component{
    constructor(){
        super();
        this.layers = Render.layer;
        this.depth = 0;
        this.canvas = Render.CreateRender();
        this.viewport = {
            x:0,y:0,width:1,height:1
        };
    }
    Awake(){
        // this.gameObject.transform.position = new Vector(100,0);
    }
    Start(){
        
    }

    Update(dt){
        
    }

    Render(dt){
        let table = [];
        let tree = this.gameObject.scene.data;
        let data = [];
        for(var i in tree){
            this.Tree(tree[i],table);
        }
        for(var i in table){
            data = data.concat(table[i]);
        }
        Render.Clear(this.canvas);
        this.canvas.save();
        let centerX = (this.canvas.canvas.width / 2)|0;
        let centerY = (this.canvas.canvas.height / 2)|0;
        this.canvas.translate(centerX,centerY);
        this.Origin(this.gameObject);
        for(var i in data){
            this.CameraRender(data[i]);
        }
        this.canvas.restore();

        let light = this.gameObject.scene.light;
        this.canvas.save();
        this.canvas.fillStyle = light.color;
        this.canvas.drawImage(light.render.canvas,0,0,light.render.canvas.width,light.render.canvas.height);
        this.canvas.restore();
    }
    CameraRender(gameObject){
        this.canvas.save();
        gameObject.transform.Translate(this);
        if(gameObject.render){
            this.canvas.imageSmoothingEnabled = !gameObject.render.pixel;
            this.canvas.globalAlpha = gameObject.render.alpha;
            this.canvas.drawImage(gameObject.render.canvas,-gameObject.transform.anchor.x * gameObject.render.canvas.width|0,-gameObject.transform.anchor.y * gameObject.render.canvas.height|0);
        }
        if(gameObject.light){
            let light = gameObject.scene.light.render;
            light.save();
            let t = this.canvas.getTransform();
            light.setTransform(t.a,t.b,t.c,t.d,t.e,t.f);
            light.drawImage(gameObject.light.canvas,(-0.5 * gameObject.light.canvas.width)|0,(-0.5 * gameObject.light.canvas.height)|0);
            //颜色光构想
            // light.globalCompositeOperation = "destination-over";
            // light.drawImage(gameObject.light.canvas,(-0.5 * gameObject.light.canvas.width)|0,(-0.5 * gameObject.light.canvas.height)|0);
            light.restore();
        }
        this.canvas.restore();
    }
    Tree(gameObject,table){
        if((gameObject.render || gameObject.light) && Render.layers.includes(gameObject.layer)){
            if(table[gameObject.zoom]){
                table[gameObject.zoom].push(gameObject);
            }else{
                table[gameObject.zoom] = [gameObject];
            }
        }
        for(var i in gameObject.data){
            this.Tree(gameObject.data[i],table);
        }
    }
    Origin(gameObject){
        this.canvas.rotate(-gameObject.transform.rotate * Math.PI/180);
        this.canvas.translate(-gameObject.transform.position.x,-gameObject.transform.position.y);
        if(gameObject.parent)this.Origin(gameObject.parent);
    }
}