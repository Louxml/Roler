import { Scene } from "../../scene/src/Scene.js";
import { SceneManager } from "../../scene/src/SceneManager.js";
import { Application } from "../src/Application.js";



function test1(){
    const app = new Application({
        render: "webgl",
        width:window.innerWidth, height:window.innerHeight,
        target:document.body,
        backgroundColor: {r:0x66, g:0x99, b:0xff},
    });

    console.log(app);
}


test1();