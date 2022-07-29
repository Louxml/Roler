import { SceneManager, Scene} from "../src/index.js"

let scene1 = new Scene("1");
console.log(SceneManager.getInstance().activeScene)
// SceneManager.getInstance().startScene(scene1)