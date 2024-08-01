


import { TextureSource } from "./TextureSource.js";



export class CompressedSource extends TextureSource {

    uploadMethodId = "compressed";
    
    constructor(options){
        super({
            ...options,
            mipLevelCount: this.resource.length
        });
    }
}