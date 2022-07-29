import { UPDATE_PRIORITY } from "./const.js";
import { RunListener } from "./RunListener.js";

// 暂定常量
const deltatime = 1/60

/**
 * 运行器
 * 可优化：
 * 1、运行期的开始和结束可以判断是否有监听器，有则开始，无则停止
 * 2、时间戳上可优化，第一帧时间戳好像有问题
 * 3、还没考虑帧率的问题，默认requestAnimationFrame帧率
 */
export class Runner{
    
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
        if (options.autoStart) this._started = true;
        this._head = new RunListener(null, null, false, Infinity);


        this._runner = (time) => {
            if (this._started){
                this._update(time)
                if (this._started){
                    this._requestId = requestAnimationFrame(this._runner);
                }
            }
        }
        this._runner()
    }

    start(){
        if (!this._started){
            this._started = true;
            this._requestAnimationFrame()
        }
        return this;
    }

    stop(){
        if (this._started){
            this._started = false;
            this._cancelAnimationFrame()
        }
        return this;
    }

    add(fn = ()=>{}, context = null, once = false, priority = UPDATE_PRIORITY.NORMAL){
        let listener = new RunListener(fn, context, once, priority);
        this._addListener(listener)
        return this;
    }

    addOnce(fn = ()=>{}, context = null, priority = UPDATE_PRIORITY.NORMAL){
        let listener = new RunListener(fn, context, this, priority);
        this._addListener(listener)
        return this;
    }

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
     * @private
     */
    _requestAnimationFrame(){
        if (this._requestId === null){
            this._requestId = requestAnimationFrame(this._runner);
        }
    }

    /**
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
    _update(time = performance.now()){
        this._deltatime = time - this._lasttime;
        
        const head = this._head;
        let listener = head.next;
        while (listener){
            listener = listener.emit(this._deltatime)
        }

        this._lasttime = time;
    }
}