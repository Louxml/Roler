import {ViewSystem} from "../src/view/ViewSystem.js"

import { Renderer, Buffer, Program } from "../src/index.js"

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

// test1();

// test2();

// test3();

// test4();

// test5()