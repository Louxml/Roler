import { Scene } from "../../scene/src/Scene.js";
import { SceneManager } from "../../scene/src/SceneManager.js";
import { Application } from "../src/Application.js";



function test1(){
    const app = new Application({
        render: "webgl",
        width:window.innerWidth, height:window.innerHeight,
        target:document.body,
        backgroundColor: {r:0x33, g:0x66, b:0xff, a:0x22},
        backgroundAlpha: 0.5
    });

    console.log(app);
}


test1();