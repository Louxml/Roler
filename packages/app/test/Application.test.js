import { Scene } from "../../scene/src/Scene.js";
import { SceneManager } from "../../scene/src/SceneManager.js";
import { Application } from "../src/Application.js";



function test1(){
    const app = new Application({
        render: "canvas",
        // width:window.innerWidth, height:window.innerHeight,
        target:document.body
    });

    console.log(app);
}


test1();