import { SceneManager, Scene} from "../src/index.js"
class TestScene extends Scene{
    constructor(name){
        super(name)

        this.t = 0;
        this.f = true
    }

    onEnter(){
        console.log("Enter", this.name)
    }

    onUpdate(dt){
        if(this.f)this.t += dt;

        if(this.t > 3000){
            this.f = false;
            this.t = 0;

            console.log("update")

            this.destory();
        }
    }

    onExit(){
        console.log("Exit")
    }
}
let test = new TestScene("test");
SceneManager.getInstance().addScene(test).startScene(test);
console.log(SceneManager.getInstance().getMainScene());