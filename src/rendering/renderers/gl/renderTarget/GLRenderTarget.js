


export class GLRenderTarget {

    
    width = -1;
    height = -1;
    msaa = false;
    /**
     * 帧缓存，用于显示，处理msaa之后的帧缓冲
     * @type {WebGLFramebuffer}
     */
    framebuffer;
    /** 目标渲染帧缓冲 */
    resolveTargetFramebuffer;
    /**
     * msaa的渲染缓冲，每个纹理对应一个
     * @type {WebGLRenderbuffer[]}
     */
    msaaRenderBuffer = [];

    /**
     * 深度模板缓冲
     * @type {WebGLRenderbuffer}
     */
    depthStencilRenderBuffer;
}