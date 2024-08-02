import { ExtensionType } from "../../../../../extensions/index.js";
import { TextureSource } from "./TextureSource.js";



export class BufferImageSource extends TextureSource {

    /** @ignore */
    static extension = ExtensionType.TextureSource;

    uploadMethodId = 'buffer';

    constructor(options){

        /** rgba四个通道，这里用Float32Array在webgl1不支持 */
        const buffer = options.resource || new Uint8Array(options.width * options.height * 4);
        let format = options.format;

        if (!format){
            if (buffer instanceof Float32Array){
                format = 'rgba32float';
            }else if (buffer instanceof Int32Array){
                format = 'rgba32sint';
            }else if (buffer instanceof Uint32Array){
                format = 'rgba32uint';
            }else if (buffer instanceof Int16Array){
                format = 'rgba16sint';
            }else if (buffer instanceof Uint16Array){
                format = 'rgba16uint';
            }else if (buffer instanceof Int8Array){
                format = 'rgba8snorm';
            }else{
                format = 'rgba8unorm';
            }
        }

        super({
            ...options,
            resource: buffer,
            format
        });
    }
    

    static test(resource){
        return resource instanceof Int8Array
        || resource instanceof Uint8Array
        || resource instanceof Uint8ClampedArray
        || resource instanceof Int16Array
        || resource instanceof Uint16Array
        || resource instanceof Int32Array
        || resource instanceof Uint32Array
        || resource instanceof Float32Array
    }
}