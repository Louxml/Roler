

import { glUploadImageResource } from "./glUploadImageResource.js"


export const glUploadVideoResource = {
    id: 'video',

    upload(source, glTexture, gl, webGLVersion){

        // 视频资源是否加载完毕，没加载完则不进行上传
        if (!source.isValid){
            gl.texImage2D(
                glTexture.target,
                0,
                glTexture.internalFormat,
                1,
                1,
                0,
                glTexture.format,
                glTexture.type,
                null
            );
        }

        glUploadImageResource.upload(source, glTexture, gl, webGLVersion);
    }
}