
// 导出EventEmitter类
export class EventEmitter {

    /**
     * 用于存储事件监听器
     */
    #addListeners;
    
    constructor() {
        this.#addListeners = Object.create(null);
    }

    /**
     * 注册事件监听器
     * @param {String} event 事件名
     * @param {Function} callback 事件监听器的回调函数
     */
    on(event, callback, context) {
        this.#addListeners[event] ??= [];
        
        this.#addListeners[event].push([callback, context]);
    }

    
    /**
     * 删除指定事件的监听器回调函数
     * @param {String} event 事件名
     * @param {Function} callback 事件监听器回调函数
     * @returns 
     */
    off(event, callback, context) {
        if (!this.#addListeners[event]) {
            return
        }
        
        this.#addListeners[event] = this.#addListeners[event].filter(
            (listener) => !(listener[0] === callback && listener[1] === context)
        )
        
        if (this.#addListeners[event].length === 0) {
            delete this.#addListeners[event]
        }
    }

    /**
     * 用于触发指定事件
     * @param {String} event 事件名
     * @param  {...any} args 回调参数
     * @returns 
     */
    emit(event, ...args) {
        if (!this.#addListeners[event]) {
            return
        }
        
        // 遍历事件监听器列表，并执行回调函数
        this.#addListeners[event].forEach((listener) => {
            if (listener[1]) {
                listener[0].call(listener[1], ...args);
            }else {
                listener[0](...args);
            }
        })
    }

    /**
     * 定义once方法，用于触发一次事件
     * @param {String} event 事件名
     * @param {Function} callback 事件监听器回调函数
     */
    once(event, callback, context) {
        const onceCallback = (...args) => {
            callback.call(context, ...args)
            this.off(event, onceCallback)
        }

        this.on(event, onceCallback)
    }

    /**
     * @description 清空事件监听器列表
     */
    clear() {
        this.#addListeners = Object.create(null);
    }
}