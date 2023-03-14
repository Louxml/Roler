import { UPDATE_PRIORITY } from "./const.js";
import { TickerListener } from "./TickerListener.js";

// 暂定常量
const deltatime = 1/60

// 默认配置
const config = {
    autoStart: false,
    speed: 1
}

/**
 * 循环器
 * 可优化：
 * 1、还没考虑帧率的问题，默认requestAnimationFrame帧率（最高帧率）
 */
export class Ticker{
    /**
     * 基础实例
     * @private
     */
    static _system;

    /**
     * 共享实例
     * @private
     */
    static _shared;
    /**
     * id
     * @private
     */
    _requestId = null;

    /**
     * 主体
     * @private
     */
    _tick;

    /**
     * 监听器链表
     * @private
     */
    _head;

    /**
     * 是否开始
     * @Boolean
     * @public
     */
    started = false;


    /**
     * 速度
     * @Number
     * @public
     */
    speed = 1;


    /**
     * 受速度影响的时间
     * @Number
     * @public
     */
    _elapsedtime = 0;

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
        if (new.target !== Ticker) return;

        // 配置
        options = Object.assign(this, config, options);

        // 链表的控制节点
        this._head = new TickerListener(null, null, false, Infinity);


        this._tick = (time = performance.now()) => {
            this._requestId = null;
            if (this.started){
                this._update(time)
                if (this.started){
                    this._requestId = requestAnimationFrame(this._tick);
                }
            }
        }
    }

    /**
     * 开始运行器
     * @public
     * @returns this 返回改对象（用于链式调用）
     */
    start(){
        if (!this.started){
            this.started = true;
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
        if (this.started){
            this.started = false;
            this._cancelAnimationFrame();
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
        let listener = new TickerListener(fn, context, once, priority);
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
        let listener = new TickerListener(fn, context, this, priority);
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
            this._tick = null;
            this._head = null;
        }
    }

    /**
     * 添加监听器
     * @param {TickerListener} listener 
     * @private
     */
    _addListener(listener){
        const head = this._head;
        let pre = head;
        while (pre.next && pre.next.priority >= listener.priority){
            pre = pre.next;
        }
        pre.connect(listener);

        if (this.autoStart)this.start()
    }

    /**
     * 开始帧动画
     * @private
     */
    _requestAnimationFrame(){
        if (this._requestId === null){
            this._lasttime = performance.now();
            this._requestId = requestAnimationFrame(this._tick);
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
        if (time > this._lasttime){
            this._elapsedtime = time - this._lasttime;

            this._deltatime = this._elapsedtime * this.speed;

            const head = this._head;
            let listener = head.next;
            while (listener){
                // 执行更新事件
                listener = listener.emit(this._deltatime)
            }

            if (!head.next)this.stop();
        }else{
            this._deltatime = this._elapsedtime = 0;
        }

        // 更新上一次时间戳
        this._lasttime = time;
    }


    /**
     * 帧率（每秒运行次数）
     * @Number
     * @public
     */
    get FPS(){
        return 1000 / this._elapsedtime;
    }


    /**
     * 共享实例
     * @static
     * @public
     */
    static get shared(){
        if (!Ticker._shared){
            const shared = Ticker._shared = new Ticker();

            shared.autoStart = true;
            shared._protected = true;
        }

        return Ticker._shared;
    }

    /**
     * 基础实例
     * @static
     * @public
     */
    static get system(){
        if (!Ticker._system){
            const system = Ticker._system = new Ticker();

            system.autoStart = true;
            system._protected = true;
        }

        return Ticker._system;
    }
}
