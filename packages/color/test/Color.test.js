
import { Color } from "../src/index.js";



function test1(){
    let c = new Color(155/255, 121/255, 58/255);
    console.log(c.toHSLAString())
    console.log(c.toHSVAString())
    console.log(c.toHexString())
    console.log(c.value)

    // 0xffffff
    // 0xffffffff
    // "#fff"
    // "#ffff"
    // "#ffffff"
    // "#ffffffff"
    // console.log(new Color(0xfff))
    // new Color("0xfffa")
    // new Color("0xfffff")
    // new Color("0xffffff")
    // new Color("0xfffffff")
    // new Color("0xffffffaf")

    // new Color("#fff")
    // new Color("#fffa")
    // new Color("#fffff")
    // new Color("#ffffff")
    // new Color("#fffffff")
    // new Color("#ffffffaf")

    // new Color("fff")
    // new Color("fffa")
    // new Color("fffff")
    // new Color("ffffff")
    // new Color("fffffff")
    // new Color("ffffffaf")
}

function test2(){
    // console.log(new Color("#9b793a").toHexAString())
    // console.log(new Color("rgba(1, 1, 1, 1)").toHexAString())
    // console.log(new Color("hsla(39, 45.54, 41.76, 100)").toHexAString())
    // console.log(new Color("hsva(39, 62.58, 60.78, 100)").toHexAString())
}

function test3(){
    console.log(new Color({ r: 0x9b, g: 0x79, b: 0x3a, a: 0xff }).toHexAString())
    console.log(new Color({ h: 39 + 360, s: 45.54, l: 41.76, a: 100 }).toHexAString())
    console.log(new Color({ h: 39, s: 62.58, v: 60.78, a: 101 }).toHexAString())
}

// test1()

// test2()

// test3()