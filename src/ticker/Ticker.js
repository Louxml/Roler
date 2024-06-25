import { UPDATE_PRIORITY } from "./const.js";
import { TickerListener } from "./TickerListener.js";


/**
 * 循环器
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
     * 默认配置
     */
    static defaultOptions = {
        autoStart: false,
        speed: 1,
        minFPS: 1,
        maxFPS: Infinity,
    }

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
     * 上一次(tick调用)时间戳
     * @Number
     * @private
     */
    lasttime = 0;

    /**
     * 时间差，受速度影响和帧率限制
     * @Number
     * @private
     */
    deltatime = 0;

    /**
     * 实际（tick调用）时间差，不受速度影响和帧率限制
     * @Number
     * @public
     */
    elapsedtime = 0;


    /**
     * 是否受保护
     * @Boolean
     * @private
     */
    _protected = false;

    /**
     * 上一帧的时间戳
     */
    _lastframe = 0;

    /**
     * 最小延迟，影响最大帧率
     * @Number
     * @private
     */
    _minelapsedtime = 0;
    

    /**
     * 最大延迟，影响最小帧率
     * @Number
     * @private
     */
    _maxelapsedtime = 1000;

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
        options = {...Ticker.defaultOptions, ...options};

        this.autoStart = options.autoStart;
        this.speed = options.speed;
        this.minFPS = options.minFPS;
        this.maxFPS = options.maxFPS;



        // 链表的控制节点
        this._head = new TickerListener(null, null, false, Infinity);


        this._tick = (time = performance.now()) => {
            this._requestId = null;
            if (this.started){
                this.update(time)
                if (this.started && this._head.next){
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
    add(fn, context = null, priority = UPDATE_PRIORITY.NORMAL){
        return this._addListener(new TickerListener(fn, context, false, priority));
    }

    /**
     * 添加仅运行一次的帧粒子函数
     * @param {Function} fn 帧粒子函数
     * @param {Object} context 函数上下文环境
     * @param {Number} priority 优先级
     * @public
     * @returns this 返回改对象（用于链式调用）
     */
    addOnce(fn, context = null, priority = UPDATE_PRIORITY.NORMAL){
        return this._addListener(new TickerListener(fn, context, true, priority));
    }

    /**
     * 移除帧粒子函数
     * @param {Function} fn 帧粒子函数
     * @param {Object} context 函数上下文环境
     * @public
     * @returns this 返回改对象（用于链式调用）
     */
    remove(fn, context = null){
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
     * @returns this 返回改对象（用于链式调用）
     */
    _addListener(listener){
        const head = this._head;
        let pre = head;
        while (pre.next && pre.next.priority >= listener.priority){
            pre = pre.next;
        }
        pre.connect(listener);

        if (this.autoStart)this.start();

        return this;
    }

    /**
     * 开始帧动画
     * @private
     */
    _requestAnimationFrame(){
        if (this._requestId === null && this._head.next){
            this.lasttime = performance.now();
            this._lastframe = this.lasttime;
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
    update(time){

        if (time > this.lasttime){
            let elapsedMs = this.elapsedtime = time - this.lasttime;

            // 最小帧率限制
            elapsedMs = Math.min(elapsedMs, this._maxelapsedtime);

            // 最大帧率限制
            if (this._minelapsedtime){
                const delta = time - this._lastframe | 0;
                if (delta < this._minelapsedtime)return;
                this._lastframe = time - (delta % (this._minelapsedtime));
            }

            // 基于速度的时间差
            this.deltatime = elapsedMs * this.speed;

            // 运行
            const head = this._head;
            let listener = head.next;
            while (listener){
                // 执行更新事件
                listener = listener.emit(this)
            }

            // 如果没有，则停止
            if (!head.next)this.stop();
        }else{
            this.deltatime = this.elapsedtime = 0;
        }
        
        this.lasttime = time;
    }


    /**
     * 帧率（每秒运行次数）
     * @Number
     * @public
     */
    get FPS(){
        return 1000 / this.elapsedtime;
    }

    /**
     * 获取配置的最小帧率
     * @Number
     * @public
     */
    get minFPS(){
        return Math.round(1000 / this._maxelapsedtime * 10) / 10;
    }

    /**
     * 设置最小帧率
     * @Number
     * @public
     */
    set minFPS(fps){
        const minFPS = Math.max(1, Math.min(this.maxFPS, fps));

        this._maxelapsedtime = 1000 / minFPS;
    }

    /**
     * 获取配置的最大帧率
     * @Number
     * @public
     */
    get maxFPS(){
        return Math.round(1000 / this._minelapsedtime * 10) / 10;
    }

    /**
     * 设置最大帧率
     * @Number
     * @public
     */
    set maxFPS(fps){
        const maxFPS = Math.max(this.minFPS, fps);

        this._minelapsedtime = 1000 / maxFPS;
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
     * 基础实例，通常不会暂停
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
