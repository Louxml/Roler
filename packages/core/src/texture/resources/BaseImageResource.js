import { settings } from "../../../../browser/src/settings.js";
import { ALPHA_MODE, TARGETS } from "../../../../constants/src/index.js";
import { Resource } from "./Resource.js";


export class BaseImageResource extends Resource{

    /**
     * 源资源节点
     * @member {HTMLImageElement | HTMLVideoElement | ImageBitmap | HTMLCanvasElement}
     * @public
     */
    source;

    /**
     * 是否禁用局部修改
     * @Boolean
     * @default false
     * @public
     */
    noSubImage;

    constructor(source){
        const width = source.naturalWidth || source.videoWidth || source.width;
        const height = source.naturalHeight || source.videoHeight || source.height;

        super(width, height);

        this.source = source;
        this.noSubImage = false;
    }

    static crossOrigin(element, url, crossorigin){
        if (crossorigin === undefined && !url.startsWith('data:')){

            element.crossOrigin = settings.ADAPTER.determineCrossOrigin(url)

        }else if (crossorigin === null){

            element.crossOrigin = crossorigin;

        }else if(crossorigin !== false){
            
            element.crossOrigin = typeof crossorigin === 'string' ? crossorigin : 'anonymous';
        }
    }


    /**
     * TODO 上传纹理至GPU
     */
    upload(renderer, baseTexture, glTexture, source){
        const gl = renderer.gl;
        const width = baseTexture.realWidth;
        const height = baseTexture.realHeight;

        source = source || this.source;

        if (source instanceof HTMLImageElement){
            if (!source.complete || source.naturalWidth === 0){
                return false;
            }
        }else if (source instanceof HTMLVideoElement){
            if (source.readyState <= 1&& source.buffered.length === 0){
                return false;
            }
        }

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, baseTexture.alphaMode === ALPHA_MODE.UNPACK);

        if (!this.noSubImage && baseTexture.target === gl.TEXTURE_2D && glTexture.width === width && glTexture.height === height){
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, baseTexture.format, glTexture.type, source);
        }else{
            glTexture.width = width;
            glTexture.height = height;

            gl.texImage2D(baseTexture.target, 0, glTexture.internalFormat, baseTexture.format, glTexture.type, source);
        }

        return true;
    }

    /**
     * 检查宽度/高度是否修改，调整大小会导致baseTexture更新
     * 会触发onResize、onUpdate事件
     */
    update(){
        if (this.destroyed) return;
        const source = this.source;

        const width = source.naturalWidth || source.videoWidth || source.width;
        const height = source.naturalHeight || source.videoHeight || source.height;

        this.resize(width, height);

        super.update();
    }

    /**
     * 销毁处理逻辑
     */
    dispose(){
        this.source = null;
    }
}