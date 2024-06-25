

/**
 * 枚举拓展类型
 * @property {String} Application 应用插件
 */
const ExtensionType = {

    // 注册应用程序拓展
    Application: "application",

    // 注册渲染器
    Renderer: "Renderer",

    
    // 注册webgl渲染管线拓展
    WebGLPipes: "webgl-pipes",
    // 注册webgl管线适配器拓展
    WebGLPipesAdapter: "webgl-pipes-adapter",
    // 注册webgl系统拓展
    WebGLSystem: "webgl-system",

    

    // 注册Assets拓展
    Assets: "assets",
    // 注册加载解析器
    LoadParser: "load-parser",
    // 注册urls加载解析器
    ResolveParser: "resolve-parser",
    // 注册缓存解析器
    CacheParser: "cache-parser",
    // 注册添加/移除解析器
    DetectionParser: "detection-parser",

    // 注册环境拓展
    Environment: "environment",

}


/**
 * ExtensionData格式
 * @property {Array} type 插件类型
 * @property {String} name 可选，插件名字
 * @property {Number} priority 可选，插件优先级
 * @property {Any} ref 插件本身（对象、类或者构造函数）
 */
const ExtenstionMetaData = {
    type: ['type'],
    name: "name",
    priority: 0,
    ref: {}
}


/**
 * 拓展数据标准格式化
 * 补全默认值
 * @static
 * @param {Function} ext 插件类或者插件配置对象
 * @returns 标准插件配置对象
 */
const normalizeExtension = (ext) => {
    if(typeof ext === "function" || typeof ext == "object" && ext.extension){
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
            throw new Error('This extension is type error.')
        }

        // 默认值：类的名字
        metaData.name ??= ext.name;

        // name类型错误
        if(typeof metaData.name !== "string"){
            throw new Error('This extension is name error.')
        }

        // 默认值：0
        metaData.priority ??= ExtenstionMetaData.priority;
        
        // priority类型错误
        if(typeof metaData.priority !== "number"){
            throw new Error('This extension is priority error.');
        }

        ext = { ... metaData, ref: ext }
    }

    // 属性拷贝
    if(typeof ext === "object"){
        ext = { ...ext }
    }else{
        throw new Error('Extension error');
    }

    return ext;
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
        return {...this.#queue};
    }

    /**
     * 添加拓展
     * @static
     * @param  {...any} extension 要添加拓展
     * @returns 用于链式调用
     */
    static add(...extensions){
        extensions.map(normalizeExtension).forEach((ext) => {
            // 按类型添加
            ext.type.forEach((type) => {
                const handlers = this.#addHandlers;
                const queue = this.#queue;
                // 该类型没有注册添加方法，将 拓展类数据 添加到等待队列
                if(!handlers[type]){
                    queue[type] = queue[type] || [];
                    // 添加到等待队列
                    queue[type].push(ext);
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
        extensions.map(normalizeExtension).forEach((ext) => {
            // 按类型移除
            ext.type.forEach((type) => this.#removeHandlers[type]?.(ext))
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
            queue[type]?.forEach((ext) => onAdd(ext))
            // 删除等待队列
            delete queue[type];
        }

        return this;
    }

    /**
     * 为某一类型拓展添加字典管理容器(包含添加和移除方法)
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
     * 为某一类型插件添加列表管理容器（包含添加和移除方法）
     * 这个容器用到了拓展的 priority 属性，优先级越高越在前，列表呈降序
     * 没有 priority 属性，默认0
     * @static
     * @param {ExtensionType} type 插件类型
     * @param {Array} list 插件存储列表
     * @returns 用于链式调用
     */
    static handleByList(type, list){
        return this.handle(type, 
            (ext) => {
                if (list.includes(ext.ref)){
                    console.warn(`This extension already exist`);
                    return;
                }

                // 添加
                list.push(ext.ref);

                // 排降序
                list.sort((a, b) => 
                    normalizeExtension(b).priority - normalizeExtension(a).priority
                )
            },
            (ext) => {
                const i = list.indexOf(ext.ref);
                // 删除
                if(i >= 0) list.splice(i, 1);
            }
        )
    }

    /**
     * 为某一类型插件添加列表管理容器（包含添加和移除方法）
     * 这个容器用到了拓展的 priority 属性，优先级越高越在前，列表呈降序
     * 没有 priority 属性，默认0
     * @static
     * @param {ExtensionType} type 插件类型
     * @param {Array<{name: string, value: any, priority: Number}>} map 插件存储字典
     * @returns 用于链式调用
     */
    static handleByNamedList(type, map){
        return this.handle(type,
            (ext) => {
                const index = map.findIndex(item => item.name === ext.name);
                if(index >= 0){
                    console.warn(`This extension already exist`);
                    return;
                }
                
                // 添加
                const data = { name: ext.name, value: ext.ref, priority: ext.priority }
                map.push(data);
                // 排降序
                map.sort((a, b) => b.priority - a.priority);
            },
            (ext) => {
                const index = map.findIndex(item => item.name === ext.name);
                // 删除
                if(index >= 0) map.splice(index, 1);
            }
        );
    }

}

export {
    Extension,
    ExtensionType
}