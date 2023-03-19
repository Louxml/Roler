

export class Runner{

    /**
     * 运行器名字，也是内部item的调用方法名
     * @String
     * @private
     */
    _name;
    
    /**
     * 监听对象
     * @Array
     * @private
     */
    _items = [];
    
    constructor(name){
        this._name = name;
        this._items = [];
    }

    /**
     * 运行（执行）
     * @param  {...any} args 参数列表
     * @returns this 链式调用
     */
    emit(...args){
        const { name ,items } = this;
        for (let i = 0, len = items.length; i < len; i++){
            items[i][name](...args);
        }

        return this;
    }

    /**
     * 添加监听对象
     * @param {Object} item 监听对象
     * @returns this 链式调用·
     */
    add(item){
        const index = this._items.indexOf(item);
        if (index === -1 && item[this._name]){
            this._items.push(item);
        }
        return this;
    }

    /**
     * 移除监听对象
     * @param {Object} item 监听对象
     * @returns this 链式调用
     */
    remove(item){
        const index = this._items.indexOf(item);
        if (index !== -1){
            this._items.splice(index, 1);
        }

        return this;
    }

    /**
     * 检查对象是否已添加
     * @param {Object} item 监听对象
     * @returns 是否已添加
     */
    include(item){
        return this._items.includes(item);
    }

    /**
     * 移除所有监听对象
     * @returns this 链式调用
     */
    removeAll(){
        this._items = [];
        return this;
    }

    destroy(){
        this.removeAll();
        this._items = null;
        this._name = null;
    }

    
    /**
     * 获取名字
     */ 
    get name(){
        return this._name;
    }

    /**
     * 获取items
     */
    get items(){
        return this._items.map(v => v);
    }

    /**
     * 监听列表是否为空
     */
    get empty(){
        return this._items.length === 0;
    }

    get run(){
        return this.emit;
    }
    
    get dispatch(){
        return this.emit;
    }
}