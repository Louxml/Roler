import Vec2 from "../core/vec2.js";
import Mat3 from "../core/mat3.js";
class Node{
    #name = "";
    #position = new Vec2(0, 0);
    #rotation = 0;
    #scale = new Vec2(1, 1);
    #anchor = new Vec2(0.5, 0.5);
    #layer = 0;
    #order = 0;
    #childs = new Set();
    #visible = true;
    #alpha = 1;
    #state = 0;
    #refrash = true;
    constructor(){

        this.parent = null;
        this.scene = null;

        this.init();
        this.#state = 1;
    }

    set name(v){
        if(typeof v === "string"){
            this.#name = v;
        }else return;
    }
    
    get name(){
        return this.#name;
    }

    set position(v){
        if(v.constructor.name === Vec2.name){
            this.#position = v;
        }else return;
    }

    get position(){
        return this.#position;
    }

    set rotation(v){
        if(typeof v == "number"){
            this.#rotation = v;
        }else return;
    }

    get rotation(){
        return this.#rotation;
    }

    set scale(v){
        if(v.constructor.name === Vec2.name){
            this.#scale = v;
        }else return;
    }

    get scale(){
        return this.#scale;
    }

    set anchor(v){
        if(v.constructor.name === Vec2.name){
            this.#anchor = v;
        }else return;
    }

    get anchor(){
        return this.#anchor;
    }

    set visible(v){
        if(typeof v == "boolean"){
            this.#visible = v;
        }else return;
    }

    get visible(){
        return this.#visible;
    }

    get refrash(){
        return this.#refrash;
    }

    set alpha(v){
        if(typeof v == "number"){
            this.#alpha = v;
        }else return;
    }

    get alpha(){
        return this.#alpha;
    }

    set layer(v){
        if(typeof v == "number"){
            this.#layer = v;
        }else return;
    }

    get layer(){
        return this.#layer;
    }

    set order(v){
        if(typeof v == "number"){
            this.#order = v;
        }else return;
    }

    get order(){
        return this.#order;
    }

    setName(v){
        this.name = v;
    }

    getName(){
        return this.name;
    }

    setPosition(v){
        this.position = v;
    }

    getPosition(){
        return this.position.clone();
    }

    setRotation(r){
        this.rotation = r;
    }
    
    getRotation(){
        return this.rotation;
    }

    setScale(v){
        this.scale = v;
    }

    getScale(){
        return this.scale.clone();
    }

    setAnchor(v){
        this.anchor = v;
    }

    getAnchor(){
        return this.anchor.clone();
    }

    setLayer(v){
        this.layer = v;
    }

    getLayer(){
        return this.layer;
    }

    setOrder(v){
        this.order = v;
    }

    getOrder(){
        return this.order;
    }

    getTransfrom(){
        return new Mat3([
            Math.cos(this.rotation * Math.PI / 180) * this.scale.x, Math.sin(this.rotation * Math.PI / 180) * this.scale.y, this.position.x,
            -Math.sin(this.rotation * Math.PI / 180) * this.scale.x, Math.cos(this.rotation * Math.PI / 180) * this.scale.y, -this.position.y,
            0, 0, 1
        ]);
    }

    getWorldTransfrom(){
        if(this.parent == null)return this.getTransfrom();
        return Mat3.multiply(this.parent.getWorldTransfrom(),this.getTransfrom());
    }

    getRenderTransfrom(){
        return this.getWorldTransfrom();
    }

    getModleTransfrom(){
        return [0, 0];
    }

    add(node){
        node.parent = this;
        node.scane = this.scene;
        this.#childs.add(node);
    }

    remove(node){
        node.parent = null;
        node.scene = null;
        this.#childs.delete(node);
    }

    destory(clearup = false){
        this.#state = 3;
        if(clearup){
            this.parent.remove(this);
            this.onExit();
            return;
        }
        
    }

    // 生命周期函数
    // 初始化
    init(){
        
    }

    // 首次进入场景
    onEnter(){

    }

    // 更新
    update(){

    }

    // 渲染
    render(){

    }

    // 退出场景
    onExit(){

    }

}

export default Node;