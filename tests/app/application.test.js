

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
    autoDensity: true,
});

console.log(app);