import {ViewSystem} from "../src/view/ViewSystem.js"

import { Renderer } from "../src/index.js"

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

// test1();

// test2();

// test3();