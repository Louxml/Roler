import { Mat3 } from "../src/Mat3.js";
import { ObservableVec2 } from "../src/ObservableVec2.js";
import { Size } from "../src/Size.js";
import { Vec2 } from "../src/Vec2.js";


let v = Vec2.UNIT_X


v.rotate(90, new Vec2(1, 1))

// console.log("------")

// console.log(v, Vec2.getProject(v, Vec2.UNIT_X))


let v1 = new ObservableVec2(12, 10, function(){
    console.log(this)
},{a:1});

// let v2 = v1.add(new Vec2(2, 2))
// console.log(ObservableVec2.getProject(v1, Vec2.UNIT_X))
// console.log(v1)



let m = new Mat3()

let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

m.set(arr);

// console.log(m.toString())


let size = new Size(100, 100);

console.log(size.toString())