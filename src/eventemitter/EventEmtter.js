
// 导出EventEmitter类
export class EventEmitter {

    // 定义一个私有变量#addListeners
    #addListeners;
    // 构造函数
    constructor() {
        // 将#addListeners初始化为空对象
        this.#addListeners = {}
    }

    // 定义on方法，用于添加事件监听器
    on(event, callback) {
        // 如果事件监听器列表中没有该事件
        if (!this.#addListeners[event]) {
            // 则将该事件添加到#addListeners中
            this.#addListeners[event] = []
        }
        // 将事件监听器添加到#addListeners[event]中
        this.#addListeners[event].push(callback)
    }

    // 定义off方法，用于删除事件监听器
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

    // 定义emit方法，用于触发事件
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

    // 定义once方法，用于触发一次事件
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

    // 定义clear方法，用于清空事件监听器列表
    clear() {
        // 将#addListeners清空
        this.#addListeners = {}
    }
}