import { GLProgram } from "../../src/rendering/renderers/gl/shader/GLProgram.js";
import { Shader } from "../../src/rendering/renderers/shared/shader/Shader.js"


function test1(){
    let shader = new Shader();

    console.log(shader)
    // ...
}

function test2(){
    let pro = new GLProgram({
        vertex: `
        attribute vec2 aPosition;

        void main() {
            gl_Position = vec4(aPosition, 0.0, 1.0);
        }
        `,
        fragment: `
        #version 300 es

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

    console.log(shader)
}

// test1()

// test2()