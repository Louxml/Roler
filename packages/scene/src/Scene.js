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
     * 孩子节点
     * @Array
     * @private
     */
    children = [];

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
        // 执行子节点的_onEnter
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
        // 执行子节点的_onUpdate
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
        // 执行子节点的_onExit

        if(this._state === 2){
            this.onExit();
            this._state = 3;
        }
        
        
    }

    /**
     * 销毁场景
     * @public
     */
    destory(){
        this._state = 2;
        // 执行场景内对象 destory 事件
        for(let c of this.children){
            c.destory()
        }
    }

}