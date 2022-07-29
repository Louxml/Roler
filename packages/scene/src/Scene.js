import { SceneManager } from "./SceneManager.js";

/**
 * 场景
 */
export class Scene{

    /**
     * 场景ID
     * @number
     * @private
     */
    _uid;
    
    /**
     * 场景名称
     * @string
     * @public
     */
    name;

    /**
     * 孩子节点
     * @Array
     * @private
     */
    child = [];

    /**
     * 场景状态
     * 0：进入场景，1：运行中，2：退出场景，3：删除场景
     * @number
     * @protected
     */
    _state = 0;

    constructor(name=null, options={}){
        if (typeof name !== "string")name = null;
        this.name = name;
        SceneManager.getInstance().addScene(this);
    }

    // 生命周期函数
    /**
     * 进入场景
     * @override
     */
    onEnter(){

    }

    /**
     * @private
     */
    _onEnter(){
        if (this._state === 0){
            this.onEnter();
            this._state = 1
        }
    }

    /**
     * 更新
     * @param {number} dt 时间粒子
     * @override
     */
    onUpdate(dt){

    }

    /**
     * 
     * @param {number} dt 时间粒子
     * @protected
     */
    _onUpdate(dt){
        if (this._state === 1){
            this.onUpdate(dt);
        }
    }

    /**
     * 退出场景，常在切换场景时调用
     * @override
     */
    onExit(){
        
    }

    /**
     * @protected
     */
    _onExit(){
        if (this._state !== 3 || this._state !== 4) return;

        this.onExit();
        this._state = 0;
        
    }

    /**
     * 退出场景
     * @public
     */
    exit(){
        this._state = 3
        // 执行场景内对象 onExit 事件
        for(let c of this.child){
            c.exit()
        }
    }

    _onRemove(){
        
    }

}