
// 导出EventEmitter类
export class EventEmitter {

    /**
     * 用于存储事件监听器
     */
    #addListeners;
    
    constructor() {
        // 将#addListeners初始化为空对象
        this.#addListeners = Object.create(null);
    }

    /**
     * 注册事件监听器
     * @param {String} event 事件名
     * @param {Function} callback 事件监听器的回调函数
     */
    on(event, callback) {
        // 如果事件监听器列表中没有该事件
        if (!this.#addListeners[event]) {
            // 则将该事件添加到#addListeners中
            this.#addListeners[event] = []
        }
        // 将事件监听器添加到#addListeners[event]中
        this.#addListeners[event].push(callback)
    }

    
    /**
     * 删除指定事件的监听器回调函数
     * @param {String} event 事件名
     * @param {Function} callback 事件监听器回调函数
     * @returns 
     */
    off(event, callback) {
        // 如果事件监听器列表中没有该事件
        if (!this.#addListeners[event]) {
            // 则直接返回
            return
        }
        // 将#addListeners[event]中的事件监听器callback过滤掉
        this.#addListeners[event] = this.#addListeners[event].filter(
            (listener) => listener !== callback
        )

        // 如果#addListeners[event]中的事件监听器为空，则删除该事件
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
        // 如果事件监听器列表中没有该事件
        if (!this.#addListeners[event]) {
            // 则直接返回
            return
        }
        // 将#addListeners[event]中的事件监听器依次触发
        this.#addListeners[event].forEach((listener) => {
            listener(...args)
        })
    }

    /**
     * 定义once方法，用于触发一次事件
     * @param {String} event 事件名
     * @param {Function} callback 事件监听器回调函数
     */
    once(event, callback) {
        // 定义一个onceCallback函数，用于触发一次事件
        const onceCallback = (...args) => {
            // 触发一次事件
            callback(...args)
            // 删除该事件监听器
            this.off(event, onceCallback)
        }
        // 将onceCallback添加到事件监听器列表中
        this.on(event, onceCallback)
    }

    /**
     * @description 清空事件监听器列表
     */
    clear() {
        // 将#addListeners清空
        this.#addListeners = Object.create(null);
    }
}