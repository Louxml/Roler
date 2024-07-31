import { BindResource } from "../../gpu/shader/BindResource.js";


export class TextureStyle extends BindResource{

    /** @event change */
    /** @event destroy */

    static defaultOptions = {
        // 边缘绘制模式
        wrapMode: 'clamp-to-edge',
        // 缩放模式
        scaleMode: 'linear',

        lodMinClamp: 0,
        lodMaxClamp: 0,
    }

    /** 边缘绘制模式 */
    /** 纹理宽度方向 */
    wrapModeU;
    /** 纹理高度方向 */
    wrapModeV;
    /** 纹理深度方向 */
    wrapModeW;

    /** 缩放模式 */
    /** 纹理采样器小于等于纹理像素的行为 */
    magFilter;
    /** 纹理采样器大于纹理像素的行为 */
    minFilter;
    mipmapFilter;

    /** 指定最小细节级别 */
    lodMinClamp;
    /** 指定最大细节级别 */
    lodMaxClamp;

    /** 比较采样器 */
    compare;

    /** 采样器使用的最大各向异性值，一般介于1-16之间 */
    #maxAnisotropy;

    /** 销毁标记 */
    destroyed = false;


    constructor(options){
        super('textureSampler')
        options = {...TextureStyle.defaultOptions,...options}

        this.wrapMode = options.wrapMode;

        this.wrapModeU = options.wrapModeU ?? this.wrapModeU;
        this.wrapModeV = options.wrapModeV ?? this.wrapModeV;
        this.wrapModeW = options.wrapModeW ?? this.wrapModeW;

        this.scaleMode = options.scaleMode;

        this.magFilter = options.magFilter ?? this.magFilter;
        this.minFilter = options.minFilter ?? this.minFilter;
        this.mipmapFilter = options.mipmapFilter ?? this.mipmapFilter;

        this.lodMinClamp = options.lodMinClamp;
        this.lodMaxClamp = options.lodMaxClamp;

        this.compare = options.compare;

        this.maxAnisotropy = options.maxAnisotropy ?? 1;
    }

    update(){
        this.emit('change', this);
        // TODO 这里可能需要更新sharedResourceId
    }

    destroy(){
        this.destroyed = true;

        this.emit('destroy', this);
        // TODO 这里为什么还要触发 change事件
        this.emit('change', this);

        // 清空所有监听
        this.clear();
    }

    get wrapMode(){
        return this.wrapModeU;
    }

    set wrapMode(value){
        this.wrapModeU = value;
        this.wrapModeV = value;
        this.wrapModeW = value;
    }

    get scaleMode(){
        return this.magFilter;
    }

    set scaleMode(value){
        this.magFilter = value;
        this.minFilter = value;
        this.mipmapFilter = value;
    }

    get maxAnisotropy(){
        return this.#maxAnisotropy;
    }

    set maxAnisotropy(value){
        this.#maxAnisotropy = Math.min(value, 16);

        if (this.#maxAnisotropy > 1){
            this.scaleMode = 'linear';
        }
    }
}