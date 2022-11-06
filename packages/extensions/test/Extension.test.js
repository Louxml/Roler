import { ViewSystem } from "../../core/src/systems.js";
import { Extension, ExtensionType } from "../src/index.js";

console.log({ViewSystem})
Extension.add(ViewSystem)
// Extension.add(ViewSystem)

Extension.remove(ViewSystem)

const ab = {}
// Extension.handleByMap("Renderer-system", ab)

console.log(ab)


let a = new ViewSystem()
console.log(Extension.queue)