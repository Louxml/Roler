


export class GLRenderTarget {

    
    width = -1;
    height = -1;
    msaa = false;
    /**
     * 帧缓存，用于显示
     * @type {WebGLFramebuffer}
     */
    framebuffer;
    /** 目标渲染帧缓存 */
    resolveTargetFramebuffer;
    /**
     * msaa的渲染缓存
     * @type {WebGLRenderbuffer[]}
     */
    msaaRenderBuffer = [];

    /**
     * 深度模板缓存
     * @type {WebGLRenderbuffer}
     */
    depthStencilRenderBuffer;
}