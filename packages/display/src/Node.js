import { DisplayObject } from "./DisplayObject.js"
import { settings } from "../../settings/index.js"

export class Node extends DisplayObject {
    // 子节点
    #_children;
    get children(){
        return this.#_children.splice(0);
    }

    // 子节点是否排序
    sortableChildren = false;

    // 脏排序
    sortDirty = false;

    // 父节点
    parent = null;

    // 待处理
    containerUpdateTransform = () => {};

    _width = 0;
    _height = 0;
    
    constructor(){
        super();

        this.#_children = [];
        this,this.sortableChildren = settings.SORTABLE_CHILDREN;
    }
}