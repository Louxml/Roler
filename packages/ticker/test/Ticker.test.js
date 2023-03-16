import { Ticker } from "../src/index.js";

console.log(Ticker.system)

const tick1 = Ticker.system
const tick2 = Ticker.shared

tick1.maxFPS = 10

tick1.minFPS = 0

let i = 0
// tick1.add((t) => {
//     if (i%2 == 1)console.log(1);
//     i ++
// })

// tick2.add((t) => {
//     if (i%2 == 0)console.log(2);
//     i ++
// })

// console.log(tick1.FPS, tick1.minFPS, tick1.maxFPS)

tick1.add((t) => {
    console.log(1, t, Math.round(tick1.FPS))
})

tick2.add((t) => {
    console.log(2, tick2.FPS)
})