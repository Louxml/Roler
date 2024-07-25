

import { BackgroundSystem } from "../background/BackgroundSystem.js";
import { GlobalUniformSystem } from "../renderTarget/GlobalUniformSystem.js";
import { HelloSystem } from "../startup/HelloSystem.js";
import { ViewSystem } from "../view/ViewSystem.js";


// 通用系统
export const SharedSystems = [
    BackgroundSystem,
    GlobalUniformSystem,
    ViewSystem,
    HelloSystem,
];



export const SharedRenderPipes = [

];