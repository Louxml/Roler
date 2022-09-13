import { Transform } from "../src/Transform.js";



let t = new Transform();
t.rotation = 30
t.updateLocalTransform()
console.log(t.localTransform.toString())
console.log(t.toString())