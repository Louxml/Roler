

import { Application } from "../../src/index.js";
import { GLProgram } from "../../src/rendering/renderers/gl/shader/GLProgram.js";
import { Geometry } from "../../src/rendering/renderers/shared/geometry/Geometry.js";
import { Shader } from "../../src/rendering/renderers/shared/shader/Shader.js";

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


function test3(){
    let pro = new GLProgram({
        vertex: `
        attribute vec2 aPosition;
        attribute vec4 aColor;

        varying vec4 vColor;

        uniform float uTime;

        void main() {
            vColor = aColor * sin(uTime);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
        `,
        fragment: `
        precision highp float;

        uniform vec4 uTint;

        void main() {
            gl_FragColor = uTint;
        }
        `,
        name: 'test'
    });

    // console.log(pro.fragment)
    // console.log(pro.vertex)
    // console.log(pro)

    let shader = new Shader({
        glProgram: pro,
        resources: {
            // uTexture: {
            //     name: 'uTexture',
            //     value: 0,
            //     type: 'f32'
            // },
            uTint: {
                color : {
                    // value: [1, 0, 0, 1],
                    type: 'vec4<f32>'
                }
            }
        }
    });

    app.renderer.shader.bind(shader, null);

    console.log(shader)
}


// test1()

test2();

test3();