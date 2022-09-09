import { Mat3 } from "../src/Mat3.js";
import { ObservableVec2 } from "../src/ObservableVec2.js";
import { Vec2 } from "../src/Vec2.js";


let v = Vec2.UNIT_X


v.rotate(90, new Vec2(1, 1))

// console.log("------")

// console.log(v, Vec2.getProject(v, Vec2.UNIT_X))


let v1 = new ObservableVec2(()=>{
    console.log("change");
}, null, 10, 10);
// console.log(v1.x)


let m = new Mat3()

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

m.set(arr);

console.log(m.toString())