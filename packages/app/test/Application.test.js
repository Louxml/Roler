import { Application } from "../src/Application.js";

const app = new Application({
    render: "webgl",
    width:window.innerWidth, height:window.innerHeight,
    target:document.body
});

console.log(app);