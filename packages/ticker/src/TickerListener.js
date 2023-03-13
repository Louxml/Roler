import { UPDATE_PRIORITY } from "./const.js";

export class TickerListener{

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
    prev = null;

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
    constructor(fn = ()=>{}, context = null, once = false, priority = UPDATE_PRIORITY.NORMAL){
        this._fn = fn;
        this._context = context;
        this._once = once;
        this.priority = priority;
    }

    /**
     * 触发监听
     * @param {number} deltatime 时间戳
     * @public
     * @returns 返回下一个监听器
     */
    emit(deltatime){
        // 判断函数是否存在
        this._fn && this._fn.call(this._context || this, deltatime);

        const next = this.next;

        // 仅一次则注销
        this._once && this.destroy(true);

        return next;
    }

    /**
     * 判断是否相匹配
     * @param {function} fn 函数
     * @param {Object} context 上下文
     * @public
     * @returns 
     */
    match(fn = ()=>{}, context = null){
        return this._fn === fn && this._context === context;
    }

    
    /**
     * 监听器链表连接
     * @param {TickerListener} next 
     * @oublic
     */
    connect(next){
        next.prev = this;
        next.next = this.next;
        if (this.next){
            this.next.prev = next;
        }
        this.next = next;
    }

    /**
     * 注销监听器
     * @public
     */
    destroy(){
        this._destroyed = true;
        this._fn = null;
        this._context = null;

        if (this.prev){
            this.prev.next = this.next;
        }

        if (this.next){
            this.next.prev = this.prev;
        }

        const next = this.next;

        this.prev = null;
        this.next = null;

        return next;
    }
}