import { Node } from "../../display/src/Node.js";

/**
 * 场景
 */
export class Scene{
    
    /**
     * 场景名称
     * @string
     * @public
     */
    name;

    /**
     * 场景根节点
     * @Array
     * @private
     */
    root = new Node();

    /**
     * 场景状态
     * 0：进入场景，1：运行中，2：退出场景，3：重置场景
     * @number
     * @protected
     */
    _state = 0;

    constructor(name=null, options={}){
        if (typeof name !== "string")name = "scene";
        this.name = name;
    }

    addChild(node){
        this.root.addChild(node);
    }

    // 生命周期函数
    /**
     * @protected
     */
    _onEnter(){
        if (this._state === 0){
            this.onEnter();
            this._state = 1
        }
        // 执行子节点的_onEnter
        this.root._onEnter();
    }

    /**
     * 
     * @param {number} dt 时间粒子
     * @protected
     */
    _onUpdate(dt){
        // 执行子节点的_onUpdate
        this.root._onUpdate(dt);
        if (this._state === 1){
            this.onUpdate(dt);
        }
    }

    /**
     * @protected
     */
    _onExit(){
        // 执行子节点的_onExit
        this.root._onExit();

        if(this._state === 2){
            this.onExit();
            this._state = 3;
        }
    }
    
    /**
     * 进入场景
     * @override
     */
    onEnter(){

    }

    /**
     * 更新
     * @param {number} dt 时间粒子
     * @override
     */
    onUpdate(dt){

    }

    /**
     * 退出场景，常在切换场景时调用
     * @override
     */
    onExit(){
        
    }

    /**
     * 销毁场景
     * @public
     */
    destroy(){
        this._state = 2;
        // 执行场景内对象 destroy 事件
        this.root.destroy()
    }

}