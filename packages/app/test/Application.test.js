import { Application } from "../src/Application.js";

let app = new Application({
    renderer: "webgl",
    width:window.innerWidth, height:window.innerHeight,
    target:document.body
});

console.log(app);