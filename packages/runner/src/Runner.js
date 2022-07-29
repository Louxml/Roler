import { UPDATE_PRIORITY } from "./const.js";
import { RunListener } from "./RunListener.js";

// 暂定常量
const deltatime = 1/60

// 默认配置
const config = {
    autoStart: false
}

/**
 * 运行器
 * 可优化：
 * 1、还没考虑帧率的问题，默认requestAnimationFrame帧率（最高帧率）
 */
export class Runner{
    /**
     * 类实例
     * @private
     */
    static _system;
    /**
     * id
     * @private
     */
    _requestId = null;

    /**
     * 主体
     * @private
     */
    _runner;

    /**
     * 监听器链表
     * @private
     */
    _head;

    /**
     * 是否开始
     * @Boolean
     * @private
     */
    _started = false;

    /**
     * 是否受保护
     * @Boolean
     * @private
     */
    _protected = false;

    /**
     * 上一次时间戳
     * @Number
     * @private
     */
    _lasttime = 0;

    /**
     * 时间差
     * @Number
     * @private
     */
    _deltatime = 0;


    static get system(){
        return Runner._system;
    }

    /**
     * 创建运行器
     * option：{
     *      autoStart:false
     * }
     * @param {Object} options 
     * @returns 
     */
    constructor(options = {}){
        // 设置
        // 只能 new 创建
        if (new.target !== Runner) return;
        if (!Runner._system){
            this._started = true;
            this._protected = true
            Runner._system = this;
        }

        // 配置
        Object.assign(config, options);

        // 链表的控制节点
        this._head = new RunListener(null, null, false, Infinity);


        this._runner = (time = performance.now()) => {
            if (this._started){
                this._update(time)
                if (this._started){
                    this._requestId = requestAnimationFrame(this._runner);
                }
            }
        }
        this._runner()
    }

    /**
     * 开始运行器
     * @public
     * @returns this 返回改对象（用于链式调用）
     */
    start(){
        if (!this._started){
            this._started = true;
            this._requestAnimationFrame()
        }
        return this;
    }

    /**
     * 暂停运行器
     * @public
     * @returns this 返回改对象（用于链式调用）
     */
    stop(){
        if (this._started){
            this._started = false;
            this._cancelAnimationFrame()
        }
        return this;
    }

    /**
     * 添加帧粒子函数
     * @param {Function} fn 帧粒子函数
     * @param {Object} context 函数上下文环境
     * @param {Boolean} once 是否仅运行一次
     * @param {Number} priority 优先级
     * @public
     * @returns this 返回改对象（用于链式调用）
     */
    add(fn = ()=>{}, context = null, once = false, priority = UPDATE_PRIORITY.NORMAL){
        let listener = new RunListener(fn, context, once, priority);
        this._addListener(listener)
        return this;
    }

    /**
     * 添加仅运行一次的帧粒子函数
     * @param {Function} fn 帧粒子函数
     * @param {Object} context 函数上下文环境
     * @param {Number} priority 优先级
     * @public
     * @returns this 返回改对象（用于链式调用）
     */
    addOnce(fn = ()=>{}, context = null, priority = UPDATE_PRIORITY.NORMAL){
        let listener = new RunListener(fn, context, this, priority);
        this._addListener(listener)
        return this;
    }

    /**
     * 移除帧粒子函数
     * @param {Function} fn 帧粒子函数
     * @param {Object} context 函数上下文环境
     * @public
     * @returns this 返回改对象（用于链式调用）
     */
    remove(fn = ()=>{}, context = null){
        const head = this._head;
        let listener = head.next;
        while (listener){
            if (listener.match(fn, context)){
                listener = listener.destroy()
            }else{
                listener = listener.next;
            }
        }
        return this;
    }

    /**
     * 销毁运行器
     * @public
     */
    destroy(){
        if (!this._protected){
            this.stop();

            let listener = this._head.next;
            while (listener){
                listener.destroy()
            }

            this._head.destroy()
            this._runner = null;
            this._head = null;
        }
    }

    /**
     * 添加监听器
     * @param {RunListener} listener 
     * @private
     */
    _addListener(listener){
        const head = this._head;
        let pre = head;
        while (pre.next && pre.next.priority >= listener.priority){
            pre = pre.next;
        }
        pre.connect(listener);
    }

    /**
     * 开始帧动画
     * @private
     */
    _requestAnimationFrame(){
        if (this._requestId === null){
            this._requestId = requestAnimationFrame(this._runner);
        }
    }

    /**
     * 停止帧动画
     * @private
     */
    _cancelAnimationFrame(){
        if (this._requestId !== null){
            cancelAnimationFrame(this._requestId)
            this._requestId = null;
        }
    }

    /**
     * 更新
     * @param {number} time 运行时间戳
     * @private
     */
    _update(time){
        this._deltatime = time - this._lasttime;
        
        const head = this._head;
        let listener = head.next;
        while (listener){
            // 执行更新事件
            listener = listener.emit(this._deltatime)
        }

        // 更新上一次时间戳
        this._lasttime = time;
    }
}