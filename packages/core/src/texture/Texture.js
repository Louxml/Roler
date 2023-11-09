

import { BaseTexture } from "./BaseTexture.js";



export class Texture{

    /**
     * 基础纹理
     * @BaseTexture
     * @public
     */
    baseTexture;

    constructor(baseTexture){
        this.baseTexture = baseTexture;
    }

    static fromURL(url, options = {}){
        options.resourceOptions = Object.assign({autoLoad: false}, options.resourceOptions);

        const baseTexture = new BaseTexture(url, options);

        const texture = new Texture(baseTexture);

        return baseTexture.resource.load().then(() => Promise.resolve(texture));
    }

    static fromLoader(source, imageUrl, name, options){
        const baseTexture = new BaseTexture(source, Object.assign({
            scaleMode: BaseTexture.defaultOptions.scaleMode,
            // TODO 获取资源的分辨率
            resolution: 1
        }, options));

        // const { resource } = baseTexture;

        const texture = new Texture(baseTexture);

        return baseTexture.resource.load().then(() => Promise.resolve(texture));
    }
}