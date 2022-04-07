import { EventEmitter } from "../../utils/index.js"
import { Transform } from "../../math/index.js"
import { Bounds } from "./Bounds.js"

export class DisplayObject extends EventEmitter{
    
    // 是否脏排序
    sortDirty;
    // 父节点
    parent;
    // 世界透明度
    wolrdAplha;
    // 位置信息
    transform;
    // 本地透明度
    alpha;
    // 是否启用
    visible;
    // 是否渲染
    renderable;
    // 过滤器矩形
    filterArea;
    // 过滤器
    filters;
    // 是否精灵图
    isSprite;
    // 是否遮罩
    isMask;
    // 边界
    _bounds;
    // 本地边界
    _localBounds;
    // 层级
    _zIndex;
    // 已开启的过滤器
    _enabledFilters;
    // 边界ID
    _boundsID;
    // 边界矩形
    _boundsRect;
    // 本地边界矩形
    _localBoundsRect;
    // 是否已销毁
    _destroyed;
    // 遮罩数量
    #_maskRefCount;
    // 模板节点
    #tempDisplayObjectParent;
    displayObjectUpdateTransform = () => {}

    /**
     * 将源对象中的所有可枚举属性和方法混合到DisplayObject。
     *
     */
    static mixin(source){
        Object.defineProperties(DisplayObject.prototype, Object.getOwnPropertyDescriptors(source));
    }

    get destroyed(){
        return this._destroyed;
    }

    constructor(){
        super();
        this.#tempDisplayObjectParent = null;

        this.transform = new Transform();

        this.alpha = 1;

        this.visible = true;

        this.renderer = true;

        this.parent = null;

        this.worldAlpha = 1;

        this._lastSortedIndex = 0;

        this._zIndex = 0;

        this.filterArea = null;

        this.filters = null;

        this._enabledFilters = null;

        this._bounds = new Bounds();

        this._localBounds = null;

        this._boundsID = 0;

        this._boundsRect = null;

        this._localBoundsRect = null;

        this._mask = null;

        this.#_maskRefCount = 0;

        this._destroyed = false;

        this.isSprite = false;

        this.isMask = false;
    }

    calculateBounds(){}

    removeChild(child){}

    render(renderer){}

    _recursivePostUpdateTransform(){
        if (this.parent){
            this.parent._recursivePostUpdateTransform();
            this.transform.updateTransform(this.parent.transform);
        }else{
            this.transform.updateTransform(this.#tempDisplayObjectParent.transform);
        }
    }

    updateTransform(){
        this._boundsID++;
        this.transform.updateTransform(this.parent.transform);
        this.worldAlpha = this.alpha * this.parent.worldAlpha;
    }

    getBounds(skipUpdate, rect){
        if(!skipUpdate){
            
        }
    }
}