



export const Adapter = {
    
    /**
     * 创建Canvas 节点
     * @param {Number} width Canvas 宽度
     * @param {Number} height Canvas 高度
     * @returns canvas
     */
    createCanvas: (width = 0, height = 0) => {
        const canvas = document.createElement('canvas');

        canvas.width = width;
        canvas.height = height;

        return canvas;
    },


    getCanvasRenderingContext2D: () => CanvasRenderingContext2D,

    getWebGLRenderingContext: () => WebGLRenderingContext,

    getNavigator: () => navigator,

    getBaseUrl: () => document.baseURI ?? window.location.href,

    fetch: (url, options) => fetch(url, options),
}