

/**
 * 拓展类型
 * @property {String} Application 应用插件
 * @property {String} RendererSystem 渲染器系统
 * @property {String} RendererPlugin 渲染器插件
 */
const ExtensionType = {
    Renderer: "renderer",
    Application: "application",
    RendererSystem: "renderer-webgl-system",
    RendererPlugin: "renderer-webgl-plugin",
}


/**
 * ExtensionData格式
 * @property {Array} type 插件类型
 * @property {String} name 插件名字
 * @property {Number} priority 插件优先级
 * @property {Any} ref 插件本身（对象、类或者构造函数）
 */
const Data = {
    type: ['type'],
    name: "name",
    priority: -1,
    ref: {}
}


class Extension{

    /**
     * 插件不同类型的添加方法集合
     * @static
     * @private
     */
    static #addHandlers = {};

    /**
     * 插件不同类型的移除方法集合
     * @static
     * @private
     */
    static #removeHandlers = {};

    /**
     * 插件不同类型的插件类的等待队列
     * @static
     * @private
     */
    static #queue = Object.create(null);

    static get queue(){
        return Object.assign({}, this.#queue);
    }

    /**
     * 插件数据标准化
     * 补全默认值
     * @static
     * @param {Function} ext 插件类或者插件配置对象
     * @returns 标准插件配置对象
     */
    static #normalize(ext){
        if(typeof ext === "function"){
            if(!ext.extension){
                throw new Error('Extension class must have an extension object');
            }

            let metaData = ext.extension

            // 将String类型封装对象
            if (typeof metaData === "string"){
                metaData = {
                    type: [metaData]
                }
            }

            // 将string类型的type转成Array类型
            if(typeof metaData.type === "string"){
                metaData.type = [metaData.type]
            }

            // type类型错误
            if(!(metaData.type instanceof Array)){
                throw new Error('This extension is mission type.')
            }

            // 默认值：类的名字
            metaData.name ??= ext.name;

            // name类型错误
            if(typeof metaData.name !== "string"){
                throw new Error('This extension is name type error.')
            }

            // 默认值：-1
            metaData.priority ??= -1;
            
            // priority类型错误
            if(typeof metaData.priority !== "number"){
                throw new Error('This extension is priority type error');
            }

            ext = { ... metaData, ref: ext }
        }

        // 属性拷贝
        if(typeof ext === "object"){
            ext = { ...ext }
        }else{
            throw new Error('extension error');
        }

        return ext;
    }

    /**
     * 添加拓展
     * @static
     * @param  {...any} extension 要添加拓展
     * @returns 用于链式调用
     */
    static add(...extensions){
        extensions.forEach((extension) => {
            // 标准配置
            const ext = this.#normalize(extension)
            // 按类型添加
            ext.type.forEach((type) => {
                const handlers = this.#addHandlers;
                const queue = this.#queue;
                // 该类型没有注册添加方法，将 插件类 添加到等待队列
                if(!handlers[type]){
                    queue[type] = queue[type] || [];
                    const i = queue[type].indexOf(extension);
                    
                    // 等待队列是否存在
                    if(i === -1) queue[type].push(extension);
                    else{
                        throw new Error('This extension already exist');
                    }
                }else{
                    // 执行添加方法
                    handlers[type](ext);
                }
            })
        })

        return this;
    }

    /**
     * 移除拓展
     * @static
     * @param  {...any} extensions 要删除的拓展
     * @returns 用于链式调用
     */
    static remove(...extensions){
        extensions.forEach((extension) => {
            // 标准配置
            const ext = this.#normalize(extension)
            // 按类型移除
            ext.type.forEach((type) => {
                const handlers = this.#removeHandlers;
                const queue = this.#queue;
                
                // 该类型没有注册移除方法，在等待队列中找到 插件类 并移除
                if(!handlers[type]){
                    queue[type] = queue[type] || [];
                    const i = queue[type].indexOf(extension);

                    // 等地队列是否已存在
                    if(i >= 0) queue[type].splice(i, 1);
                    else{
                        throw new Error('This extension not exist');
                    }
                }else{
                    // 执行移除方法
                    handlers[type](ext);
                }
            })
        })
        return this;
    }

    /**
     * 为某一类型插件注册添加和移除的处理方法
     * @static
     * @param {ExtensionType} type 拓展类型
     * @param {Function} onAdd 拓展添加的处理方法
     * @param {Function} onRemove 拓展移除的处理方法
     * @returns 用于链式调用
     */
    static handle(type, onAdd, onRemove){
        const addHandlers = this.#addHandlers
        const removeHandlers = this.#removeHandlers

        // 该类型的方法已被注册
        if(addHandlers[type] || removeHandlers[type]){
            throw new Error(`Extension type ${type} already has a handler`);
        }

        addHandlers[type] = onAdd;
        removeHandlers[type] = onRemove;

        const queue = this.#queue;

        // 有等待插件类
        if(queue[type]){
            queue[type].forEach((extension) => {
                const ext = this.#normalize(extension)
                onAdd(ext);
            })
            // 删除等待队列
            delete queue[type];
        }

        return this;
    }

    /**
     * 为某一类型插件添加字典管理容器
     * 这个容器用到了拓展的 name 属性
     * @static
     * @param {ExtensionType} type 插件类型
     * @param {Object} map 插件存储字典
     * @returns 用于链式调用
     */
    static handleByMap(type, map){
        return this.handle(type,
            (ext) => {
                if(map[ext.name]){
                    throw new Error(`Extension name ${ext.name} already has a Extexsion`);
                }

                // 添加
                map[ext.name] = ext.ref;
            },
            (ext) => {
                // 删除
                delete map[ext.name];
            }
        )
    }

    /**
     * 为某一类型插件添加列表管理容器
     * 这个容器用到了拓展的 priority 属性，优先级越高越在前，列表呈降序
     * 没有 priority 属性，默认-1
     * @static
     * @param {ExtensionType} type 插件类型
     * @param {Array} list 插件存储列表
     * @returns 用于链式调用
     */
    static handleByList(type, list){
        return this.handle(type, 
            (ext) => {
                const i = list.indexOf(ext.ref);
                if(i >= 0){
                    throw new Error(`This extension already exist`);
                }

                // 添加
                list.push(ext.ref);

                // 排降序
                list.sort((a, b) => {
                    return b.extension.priority - a.extension.priority;
                })
            },
            (ext) => {
                const i = list.indexOf(ext.ref);
                // 删除
                if(i >= 0) list.splice(i, 1);
            }
        )
    }

}

export {
    Extension,
    ExtensionType
}