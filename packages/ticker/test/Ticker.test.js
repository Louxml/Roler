import { Ticker } from "../src/index.js";

const tick1 = Ticker.system
const tick2 = Ticker.shared

function test1(){
    let i = 0
    tick1.add((t) => {
        if (i%2 == 1)console.log(1);
        i ++
    })

    tick2.add((t) => {
        if (i%2 == 0)console.log(2);
        i ++
    })
}

function test2(){
    tick1.add((t) => {
        console.log(1, t, Math.round(tick1.FPS))
    })

    tick2.add((t) => {
        console.log(2, tick2.FPS)
    })
}