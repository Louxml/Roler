

let supported;

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

    isWebGLSupported: () => {
        if (typeof supported === "undefined"){
            supported = (() => {
                try {
                    if (!Adapter.getWebGLRenderingContext()){
                        return false
                    }

                    const contextOptions = {
                        stencil: true
                    }

                    const canvas = Adapter.createCanvas()
                    let gl = (
                        canvas.getContext('webgl', contextOptions) || 
                        canvas.getContext('experimental-webgl', contextOptions)
                    )

                    const success = !!gl?.getContextAttributes()?.stencil;
                    
                    if (gl){
                        const loseContext = gl.getExtension('WEBGL_lose_context');
                        loseContext?.loseContext();
                    }

                    gl = null;

                    return success;
                } catch (error) {
                    return false
                }
            })();
        }
        
        return supported;
        
    }
}