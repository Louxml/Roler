import { Scene } from "../../scene/src/Scene.js";
import { SceneManager } from "../../scene/src/SceneManager.js";
import { Application } from "../src/Application.js";

const app = new Application({
    render: "webgl",
    width:window.innerWidth, height:window.innerHeight,
    target:document.body
});



// const scene = new Scene();
// app.scenes.addScene(scene);

// app.scenes.startScene(scene);

console.log(app);