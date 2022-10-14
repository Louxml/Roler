import { SceneManager, Scene} from "../src/index.js";
import { Runner } from "../../runner/src/index.js";
import { Node } from "../../display/src/Node.js";

class TestScene extends Scene{
    constructor(name){
        super(name)

        this.t = 0;
        this.f = true
    }

    onEnter(){

        const n1 = new Node();
        n1.size.set(100, 100)
        n1.anchor.set(0.5, 0.5)
        n1.position.set(100, 100)

        const n2 = new Node();
        n2.position.set(0, -100);
        n1.addChild(n2)

        n2.onEnter = () => {
            console.log(n1)
        }
        n2.onUpdate = (dt) => {
            console.log(n2.transform.worldTransform.toString())
        }

        this.addChild(n1);
        
        console.log("Enter", this)
    }

    onUpdate(dt){
        if(this.f)this.t += dt;
        
        if(this.t > 1000){
            this.f = false;
            this.t = 0;

            console.log("destory")

            this.destory();
        }
    }

    onExit(){
        console.log("Exit")
    }
}
let test = new TestScene("test");
SceneManager.getInstance().addScene(test).startScene(test);
// console.log(SceneManager.getInstance().getMainScene());