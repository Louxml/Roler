

// 导出BrowserAdapter对象，包含一些浏览器相关的适配函数
export const BrowserAdapter = {
    /**
     * 创建指定宽度和高度的canvas
     * @param {Number} width 宽度
     * @param {Number} height 高度
     * @returns canvas
     */
    createCanvas: (width, height) => {
        // 创建一个canvas元素
        const canvas = document.createElement('canvas');
        // 设置canvas的宽度和高度
        canvas.width = width;
        canvas.height = height;
        // 返回canvas元素
        return canvas;
    },

    /**
     * 获取canvas的2D上下文的类
     * @returns canvasRenderingContext2D
     */
    getCanvasRenderingContext2D: () => CanvasRenderingContext2D,

    /**
     * 获取WebGL渲染上下文的类
     * @returns WebGLRenderingContext
     */
    getWebGLRendereringContext: () => WebGLRenderingContext,

    /**
     * 获取navigator对象
     * @returns navigator
     */
    getNavigator: () => navigator,

    /**
     * 获取当前页面的基本URL
     * @returns String
     */
    getBaseUrl: () => (document.baseURI || window.location.href),

    /**
     * 获取fontFaceSet对象
     * @returns fontFaceSet
     */
    getFontFaceSet: () => document.fonts,

    /**
     * 发起网络请求
     * @param {String} url 请求的URL
     * @param {Object} options 请求的选项
     * @returns Promise
     */
    fetch: (url, options) => fetch(url, options),

    /**
     * 将XML字符串解析为DOM节点
     * @param {String} xml XML字符串
     * @returns Promise
     */
    parseXML: (xml) => new DOMParser().parseFromString(xml, 'text/xml'),
};