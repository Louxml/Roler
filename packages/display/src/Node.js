import { DEG_TO_RAD, RAD_TO_DEG, Transform } from "../../math/src/index.js";

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

    get worldAlpha(){
        return this.#worldAlpha
    }

    constructor(){
        this.transform = new Transform();
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
     * 更新节点
     * @private
     */
    update(){
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
        this.#children.push(node);
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
    }

}