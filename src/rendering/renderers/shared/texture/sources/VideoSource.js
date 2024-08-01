


import { ExtensionType } from "../../../../../extensions/index.js";
import { TextureSource } from "./TextureSource.js";


export class VideoSource extends TextureSource {

    static extension = ExtensionType.TextureSource;

    uploadMethodId = "video";
    
    constructor(options){
        super(options);

        // TODO VideoSource
    }

    test(resource){
        return (globalThis.HTMLVideoElement && resource instanceof HTMLVideoElement)
        || (globalThis.VideoFrame && resource instanceof VideoFrame);
    }
}