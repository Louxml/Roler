

import { Application } from "../../src/index.js";

const app = new Application();

await app.init({
    width: window.innerWidth,
    height: window.innerHeight,
    autoDensity: true,
});

console.log(app);