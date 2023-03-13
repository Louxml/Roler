import { Ticker } from "../src/index.js";

console.log(Ticker.system)

Ticker.system.addOnce((t) => {
    console.log(t)
})