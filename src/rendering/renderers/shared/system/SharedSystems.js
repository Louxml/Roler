

import { BackgroundSystem } from "../background/BackgroundSystem.js";
import { HelloSystem } from "../startup/HelloSystem.js";
import { ViewSystem } from "../view/ViewSystem.js";


// 通用系统
export const SharedSystems = [
    BackgroundSystem,
    ViewSystem,
    HelloSystem,
];



export const SharedRenderPipes = [

];