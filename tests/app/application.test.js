

import { Application } from "../../src/index.js";

const target = document.body

const config = {
    render: "webgl",    // 渲染方式： "webgl" | "webgpu"
    target:  target,    // 渲染目标
    webgpu: {},         // WebGPU 配置
    webgl: {}           // WebGL 配置
}

const app = new Application();

await app.init({
    ...config,
    width: window.innerWidth,
    height: window.innerHeight,
    // backgroundAlpha: 1,
    preferWebGLVersion: 1,
    autoDensity: true,
});

console.log(app);



function test1(){
    setTimeout(() => {
        app.renderer.context.forceContextLoss();
    }, 1000);

}



// test1()