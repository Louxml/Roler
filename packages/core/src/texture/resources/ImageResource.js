
import { BaseImageResource } from "./BaseImageResource.js";
import { ResourcePlugins } from "./Resource.js";

export class ImageResource extends BaseImageResource{

    /**
     * TODO 这里的url可能是Resource抽象类的src属性
     * 资源路径
     * @String
     * @public
     */
    url;

    /**
     * 上传promise
     */
    #load;

    // TODO 待做createbitmap

    constructor(source, options = {}){
        if (typeof source === 'string'){
            const image = new Image();
            BaseImageResource.crossOrigin(image, source, options.crossOrigin);
            image.src = source;
            source = image;
        }

        super(source);

        this.url = source.src;

        if (options.autoLoad !== false){
            this.load();
        }
    }

    load(createBitmap){
        if (this.#load){
            return this.#load;
        }

        // if (createBitmap !== undefined) {
        //     this.createBitmap = createBitmap
        // }

        

        this.#load = new Promise((resolve, reject) => {
            const source = this.source;
            this.url = source.src;

            const complete = () => {
                if (this.destroyed){
                    return;
                }

                source.onload = null;
                source.oneror = null;
                this.#load = null;

                this.resize(source.width, source.height);

                resolve(this);
            }

            if (source.complete && source.src){
                complete();
            }else{
                source.onload = complete;
                source.onerror = (e) => {
                    reject(e);
                    this.onError.emit(e);
                }
            }
        });

        return this.#load;
    }

    upload(renderer, baseTexture, glTexture){
        return super.upload(renderer, baseTexture, glTexture);
    }

    dispose(){
        const source = this.source;

        source.onload = null;
        source.onerror = null;

        super.dispose();

        this.#load = null;
    }

    static test(source, extension){
        return typeof HTMLImageElement !== 'undefined' && (typeof source  === 'string' || source instanceof HTMLImageElement)
    }
}

ResourcePlugins.push(ImageResource);