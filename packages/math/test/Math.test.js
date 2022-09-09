import { Mat3 } from "../src/Mat3.js";
import { Vec2 } from "../src/Vec2.js";


let v = Vec2.UNIT_X


v.rotate(90, new Vec2(10, 0))


// console.log(Vec2.getProject(v, Vec2.UNIT_X))


let m = new Mat3()

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

m.set(arr);

console.log(m.toString())