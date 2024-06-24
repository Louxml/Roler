

import { Ticker } from '../../src/ticker/Ticker.js';



let myTicker = new Ticker({
    autoStart: true, // default: false
    // speed: 2,
    maxFPS: 60,
});

let fps = 0;
let time = 0;
let tt = 1000;

// myTicker.add((ticker) => {
//     // console.log(myTicker.minFPS, myTicker.maxFPS, myTicker._minelapsedtime, myTicker._maxelapsedtime)
//     // console.log(performance.now() - ticker.lasttime, ticker.elapsedtime, ticker.deltatime);
//     fps += 1;
//     time += ticker.deltatime;
//     if (time >= tt) {
//         console.log(fps*1000/tt);
//         fps = 0;
//         time = 0;
//     }
// })