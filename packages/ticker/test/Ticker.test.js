import { Ticker } from "../src/index.js";

console.log(Ticker.system)

const tick1 = Ticker.system
const tick2 = Ticker.shared

let i = 0
tick1.add((t) => {
    if (i%2 == 1)console.log(1);
    i ++
})

tick2.add((t) => {
    if (i%2 == 0)console.log(2);
    i ++
})