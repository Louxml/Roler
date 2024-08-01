


import { DOMAdapter } from "../../../../../environment/Adapter.js";
import { ExtensionType } from "../../../../../extensions/index.js";
import { TextureSource } from "./TextureSource.js";



export class CanvasSource extends TextureSource {
    
    static extension = ExtensionType.TextureSource;

    uploadMethodId = 'image';

    /** 设置css宽高 */
    autoDensity;

    /** 是否透明 */
    transparent;

    constructor(options) {

        options.resource ??= DOMAdapter.get().createCanvas();

        super(options);

        const canvas = options.resource;
        if (this.pixelWidth !== canvas.width || this.pixelHeight !== canvas.height){
            this.resizeCanvas();
        }

        this.autoDensity = options.autoDensity;
        this.transparent = !!options.transparent;
    }

    
    /** 重置Canvas大小，会清空画布 */
    resizeCanvas(){
        if (this.autoDensity){
            this.resource.style.width = `${this.width}px`;
            this.resource.style.height = `${this.height}px`;
        }
        
        if (this.resource.width !== this.pixelWidth || this.resource.height !== this.pixelHeight){
            this.resource.width = this.pixelWidth;
            this.resource.height = this.pixelHeight;
        }
    }

    /**
     * 重写基类resize方法，当尺寸变化时，重置canvas大小
     * @override
     */
    resize(width, height, resolution){
        const isResize = super.resize(width, height, resolution);
        if (isResize){
            this.resizeCanvas();
        }
        return isResize;
    }

    
    static test(resource){
        return (globalThis.HTMLCanvasElement && resource instanceof HTMLCanvasElement)
        || (globalThis.OffscreenCanvas && resource instanceof OffscreenCanvas);
    }
}