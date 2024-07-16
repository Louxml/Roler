

import { Application } from "../../src/index.js";
import { GLProgram } from "../../src/rendering/renderers/gl/shader/GLProgram.js";
import { BufferResource } from "../../src/rendering/renderers/shared/buffer/BufferResource.js";
import { Buffer } from "../../src/rendering/renderers/shared/buffer/Buffer.js";
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
    // preferWebGLVersion: 1,
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
        #version 300 es

        layout(std140) uniform colorGroup {
            vec4 uTintColor;
            float u_time;
            vec4[5] u_colors;
        };

        in vec2 aPosition;
        in vec4 aColor;

        out vec4 vColor;

        uniform float uTime;

        void main() {
            vColor = aColor * sin(uTime);
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
        `,
        fragment: `
        precision highp float;

        uniform vec4 uTint;

        out vec4 finalColor;

        void main() {
            finalColor = uTint;
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
            light: {
                uTint : {
                    value: [1, 0, 0, 1],
                    type: 'vec4<f32>',
                }
            },
            colorGroup: new BufferResource({
                buffer: new Buffer({
                    data: [1, 0, 0, 1],
                })
            })
        }
    });

    app.renderer.shader.bind(shader);

    console.log(shader)
}


function test4(gl){
    console.log(gl)
    const vertexShader = `#version 300 es

    in vec4 aPosition;
    out vec2 TexCoords;
    
    void main()
    {
        TexCoords = aPosition.xy;
        gl_Position = aPosition;
    }
    `;
    const fragmentShader = `#version 300 es
    precision mediump float;

    out vec4 FragColor;

    in vec2 TexCoords;
    void main()
    {
        vec4 color = vec4(TexCoords, 0.0, 1.0);
        FragColor = color;
    }
    `;
    const glVertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(glVertShader, vertexShader);
    gl.compileShader(glVertShader);
    const glFragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(glFragShader, fragmentShader);
    gl.compileShader(glFragShader);

    // 创建WebGLProgram，设置顶点和片元着色器
    const webGLProgram = gl.createProgram();
    gl.attachShader(webGLProgram, glVertShader);
    gl.attachShader(webGLProgram, glFragShader);


    // 链接
    gl.linkProgram(webGLProgram);


    if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(webGLProgram));
    }

    gl.useProgram(webGLProgram);
}


// test1()

test2();

test3();


// test4(app.renderer.gl);