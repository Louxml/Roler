import { Vec2 } from "../src/Vec2.js";


let v = Vec2.UNIT_X


v.rotate(90, new Vec2(10, 0))


console.log(Vec2.getProject(v, Vec2.UNIT_X))