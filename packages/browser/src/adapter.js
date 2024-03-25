

let supported;

let tempAnchor;

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
        
    },
    
    /**
     * 确认源跨域
     * @param {String} url 资源url
     * @param {String} loc 本地地址
     * @returns String
     */
    determineCrossOrigin: (url, loc = globalThis.location) => {
        if (url.startsWith('data:')){
            return '';
        }

        if (!tempAnchor){
            tempAnchor = document.createElement('a');
        }

        // url补全
        tempAnchor.href = url;
        url = tempAnchor.href;

        const urlData = new URL(url);

        const samePort = (!urlData.port && loc.port === '') || (urlData.port === loc.port);

        if (urlData.hostname !== loc.hostname || !samePort || urlData.protocol !== loc.protocol){
            return 'anonymous';
        }

        return '';
    },
}