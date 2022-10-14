import { DEG_TO_RAD, RAD_TO_DEG, Transform, ObservableSize, ObservableVec2 } from "../../math/src/index.js";

/**
 * Node 节点对象
 */
export class Node{

    /**
     * 父级节点
     * @public
     */
    parent = null;

    /**
     * 孩子节点列表
     * @private
     */
    #children = [];

    /**
     * 变换
     * @public
     */
    transform;

    /**
     * 透明度
     * @public
     */
    alpha = 1;

    /**
     * 全局透明度
     * @public
     */
    #worldAlpha = 1;

    /**
     * 是否启用，false则父级节点不调用该节点的update和render
     * @private
     */
    enable = true;

    /**
     * 是否可见，false则父级节点不调用该节点的render
     * @private
     */
    visible = true;

    /**
     * 销毁状态
     * @private
     */
    destroyed = false;

    /**
     * 局部层级
     * @public
     */
    zIndex = 0;
    
    /**
     * 全局层级
     * @public
     */
    worldZIndex = 0;

    /**
     * 节点大小尺寸
     * @public
     */
    #size;

    /**
     * 锚点
     * @private
     */
    #anchor;

    /**
     * 状态
     * 0:onEnter，1:onUpdate/Render，2:onExit
     * @protected
     */
    _stats = 0;

    get x(){
        return this.transform.position.x;
    }

    set x(v){
        this.transform.position.x = v;
    }

    get y(){
        return this.transform.position.y;
    }

    set y(v){
        this.transform.position.y = v;
    }

    get position(){
        return this.transform.position;
    }

    set position(v){
        this.transform.position.set(v.x, v.y);
    }

    get rotation(){
        return this.transform.rotation;
    }

    set rotation(v){
        this.transform.rotation = v;
    }
    
    get angle(){
        return RAD_TO_DEG(this.rotation);
    }

    set angle(v){
        return this.transform.rotation = DEG_TO_RAD(v);
    }

    get scale(){
        return this.transform.scale;
    }

    set scale(v){
        this.transform.scale.set(v.x, v.y);
    }

    get skew(){
        return this.transform.skew;
    }

    set skew(v){
        this.transform.skew.set(v.x, v.y);
    }

    get pivot(){
        return this.transform.pivot;
    }

    set pivot(v){
        this.transform.pivot.set(v.x, v.y);
    }

    get anchor(){
        return this.#anchor
    }

    set anchor(v){
        this.#anchor.set(v.x, v.y);
    }

    get worldAlpha(){
        return this.#worldAlpha
    }

    get size(){
        return this.#size
    }

    set size(v){
        this.#size.set(v.widtgh, v.height);
    }

    set width(v){
        this.size.width = v;
    }

    get width(){
        return this.size.width;
    }

    set height(v){
        this.size.height = v;
    }

    get height(){
        return this.size.height;
    }

    constructor(){
        this.transform = new Transform();
        this.#size = new ObservableSize(0, 0, this._onSizeChange, this);
        this.#anchor = new ObservableVec2(0, 0, this._onAnchorChange, this);
    }

    _onSizeChange(){
        this._onAnchorChange()
    }

    _onAnchorChange(){
        
    }

    /**
     * 获取开启状态
     * @public
     * @returns 开启状态
     */
    getEnable(){
        return this.enable;
    }

    /**
     * 设置开启状态
     * @public
     * @param {Boolean} v 开启状态
     */
    setEnable(v){
        this.enable = !!v;
    }

    /**
     * 获取可视状态
     * @public
     * @returns 可视状态
     */
    getVisible(){
        return this.visible;
    }

    /**
     * 获取可视状态
     * @public
     * @param {Boolean} v 可视状态
     */
    setVisible(v){
        this.visible = v;
    }

    /**
     * 获取透明度
     * @public
     * @returns 透明度
     */
    getAlpha(){
        return this.alpha;
    }

    /**
     * 设置透明度
     * @param {Number} v 透明度
     */
    setAlpha(v){
        this.alpha = v;
    }

    /**
     * 获取全局透明度
     * @public
     * @returns 全局透明度
     */
    getWorldAlpha(){
        return this.worldAlpha
    }

    /**
     * 设置局部层级
     * @public
     * @param {Number} v 层级
     */
    setZIndex(v){
        this.zIndex = Number(v);
    }

    /**
     * 获取局部层级
     * @public
     * @returns 层级
     */
    getZIndex(){
        return this.zIndex;
    }

    /**
     * 设置全局层级
     * @public
     * @param {Number} v 层级
     */
    setWorldZIndex(v){
        this.worldZIndex = Number(v);
    }

    /**
     * 获取全局层级
     * @public
     * @returns 层级
     */
    getWorldZIndex(){
        return this.worldZIndex
    }

    /**
     * 更新节点
     * @private
     */
    update(){
        if(!this.parent)return;
        this.transform.updateTransform(this.parent.transform)

        this.#worldAlpha = this.alpha * this.parent.worldAlpha;
    }

    /**
     * 渲染节点
     * @private
     */
    render(){

    }

    /**
     * 销毁节点
     * @public
     */
    destroy(){
        this.destroyed = true;
        if(this.parent){
            this.parent.removeChild(this)
        }
    }

    /**
     * 获取孩子节点数量
     * @public
     * @returns 孩子节点数量
     */
    getChildrenCount(){
        return this.#children.length
    }

    /**
     * 获取孩子节点列表
     * @public
     * @returns 孩子节点列表
     */
    getChildren(){
        return this.#children.map(v=>v);
    }

    /**
     * 获取父级节点
     * @returns 父级节点
     */
    getParent(){
        return this.parent;
    }

    /**
     * 添加孩子节点
     * @public
     * @param {Node} node 节点
     */
    addChild(node){
        if(node.parent){
            throw "this node has parent.";
        }
        if(this.#children.includes(node)){
            throw "this node is exist in children.";
        }
        node.parent = this;

        // 更新父级transform
        node.transform._parentID = -1
        this.#children.push(node);
        // 处理更改父节点的情况
        if (node._stats == 2)node._stats = 1;
    }

    /**
     * 移除孩子节点
     * @public
     * @param {Node} node 孩子节点
     */
    removeChild(node){
        const index = this.#children.indexOf(node)
        if(index == -1){
            throw "this node is not exist."
        }
        this.#children.splice(index, 1)
        node.parent = null;
        node._stats = 2;
    }


    // 生命周期

    _onEnter(){
        if(this._stats === 0 && this.enable){
            this.onEnter();
            this._stats = 1;
        }
        // 执行子节点_onEnter
        for(const node of this.getChildren()){
            node._onEnter();
        }
    }

    _onUpdate(dt){
        if(this._stats === 1 && this.enable){
            this.update();
            this.onUpdate(dt)
        }
        // 执行子节点_OnUpdate
        for(const node of this.getChildren()){
            node._onUpdate(dt);
        }
    }

    _onExit(){
        if(this._stats === 2){
            this.onExit()
        }
        // 执行子节点_onExit
        for(const node of this.getChildren()){
            node._onExit();
        }
    }

    onEnter(){

    }

    onUpdate(){

    }

    onExit(){

    }

}