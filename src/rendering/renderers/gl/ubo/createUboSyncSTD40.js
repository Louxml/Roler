

import { createUboSyncFunction } from "../../shared/ubo/utils/createUboSyncFunction.js";
import { uboSyncFunctionSTD40 } from "../../shared/ubo/utils/uboSyncFunction.js";
import { generateArraySyncSTD40 } from "./generateArraySyncSTD40.js";


export function createUboSyncFunctionSTD40(uboElements){
    return createUboSyncFunction(
        uboElements,
        'uboStd40',
        generateArraySyncSTD40,
        uboSyncFunctionSTD40
    );
}