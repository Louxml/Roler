

import { ExtensionType } from "../../../../../extensions/index.js";
import { TextureSource } from "./TextureSource.js";


export class ImageSource extends TextureSource {
    
    /** @ignore */
    static extension = ExtensionType.TextureSource;

    uploadMethodId = 'image';

    constructor(options){

        if (!ImageSource.test(options.resource)){
            throw new Error('Invalid resource type for ImageSource');
        }

        super({
            ...options,
            // TODO 垃圾自动回收
            autoGarbageCollect: true
        });
    }


    static test(resource){
        return (globalThis.HTMLImageElement && resource instanceof HTMLImageElement)
        || (typeof ImageBitmap !== 'undefined' && resource instanceof ImageBitmap);
    }
}