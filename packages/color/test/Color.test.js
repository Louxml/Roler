
import { Color } from "../src/index.js";



function test1(){
    let c = new Color(155/255, 121/255, 58/255);
    console.log(c.toHSVAString())
    console.log(c.toHexString())
}

test1()