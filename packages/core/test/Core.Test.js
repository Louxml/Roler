import {ViewSystem} from "../src/view/ViewSystem.js"

import { Renderer, Buffer, Program, BaseTexture, Texture } from "../src/index.js"

import { System } from "../src/system/System.js";

// console.log({ViewSystem})

// let a = new ViewSystem()
// a.init({
//     width:2000,
//     height: 1000,
//     resolution: 2,
//     autoDensity: true
// })

// console.log(window.innerWidth, window.innerHeight)

// window.onresize = function(e){
//     a.resizeView(window.innerWidth, window.innerHeight)
// }

// console.log(a)

function test1(){
    const r = new Renderer()
    console.log(r)
    console.log(r.startup);
}

function test2(){
    console.log(new System())
}

function test3(){
    console.log(new ViewSystem())
}

function test4(){
    let a = new Buffer()
    a.update([1,2,3,4,5])
    // let a = Buffer.from([1,2])
    console.log(a);
}

function test5(){
    let p = new Program();
}

function test6(){
    // let tex = new BaseTexture("a.b.cc.png");
    // console.log(tex);

    const image = new Image();
    let url = 'https://www.runoob.com/try/demo_source/logo.png'
    // url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJ'
    //         + 'AAAADUlEQVQYV2P4GvD7PwAHvgNAdItKlAAAAABJRU5ErkJggg==';
    image.src = url;


    Texture.fromLoader(image, 'foo.pnf', 'foo').then((texture) => {
        let img = texture.baseTexture.resource.source
        img.style = "position:absolute;left:0px";
        // document.body.append(img);
    })

    // Texture.fromURL(image.src).then((texture) => {
    //     let img = texture.baseTexture.resource.source
    //     img.style = "position:absolute;left:0px;width:100px;";
    //     document.body.append(img);
    // })

}

// test1();

// test2();

// test3();

// test4();

// test5()

test6();