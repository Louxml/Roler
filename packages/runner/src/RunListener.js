
export class RunListener{

    /**
     * 优先级
     * @number
     * @public
     */
    priority;

    /**
     * 链表前置监听器
     * @public
     */
    previous = null;

    /**
     * 链表后置监听器
     * @public
     */
    next = null;

    /**
     * 主体函数
     * @function
     * @private
     */
    _fn;

    /**
     * 上下文环境
     * @object
     * @private
     */
    _context;

    /**
     * 是否为仅一次
     * @boolean
     * @private
     */
    _once;

    /**
     * 是否销毁
     * @boolean
     * @private
     */
    _destroyed = false;

    /**
     * 创建监听器
     * @param {function} fn 回调
     * @param {object} context 环境
     * @param {boolean} once 是否仅一次
     * @param {number} priority 优先级
     */
    constructor(fn = ()=>{}, context = null, once = false, priority = 0){
        this._fn = fn;
        this._context = context;
        this._once = once;
        this._priority = priority;
    }

    /**
     * 触发监听
     * @param {number} deltatime 时间戳
     * @returns 返回下一个监听器
     */
    emit(deltatime){
        if (this._fn){
            if (this._context){
                this._fn.call(this._context, deltatime);
            }else{
                this._fn(deltatime);
            }
        }

        const next = this.next;

        if (this._once){
            this.destroy(true);
        }

        return next;
    }

    /**
     * 判断是否相匹配
     * @param {function} fn 函数
     * @param {Object} context 上下文
     * @returns 
     */
    match(fn = ()=>{}, context = null){
        return this._fn === fn && this._context === context;
    }

    
    /**
     * 监听器链表连接
     * @param {RunListener} next 
     */
    connect(next){
        next.previous = this;
        next.next = this.next;
        if (this.next){
            this.next.previous = next;
        }
        this.next = next;
    }

    /**
     * 注销监听器
     */
    destroy(){
        this._destroyed = true;
        this._fn = null;
        this._context = null;

        if (this.previous){
            this.previous.next = this.next;
        }

        if (this.next){
            this.next.previous = this.previous;
        }

        const next = this.next;

        this.previous = null;
        this.next = null;

        return next;
    }
}