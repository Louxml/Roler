

import { Application } from "../../src/index.js";
import { Geometry } from "../../src/rendering/renderers/shared/geometry/Geometry.js";

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

function test2(){
    let geo = new Geometry({
        attributes:{
            position:[
                1,1,0, //0
                1,-1,0, //1
                -1,-1,0, //2
            ],
            color:[1,0,0,0,1,0,0,0,1],
        },
        indexBuffer:[
            0,1,2,
        ]
    });

    // console.log(geo);

    app.renderer.geometry.bind(geo, null);

    // console.log(app.renderer)
}



// test1()

test2();