

export const glUploadImageResource = {
    id: 'image',

    upload(source, glTexture, gl, webglVersion){

        // 是否预乘alpha
        const premultipliedAlpha = source.alphaMode === 'premultiply-alpha-on-upload';

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, premultipliedAlpha);

        const glWidth = glTexture.width;
        const glHeight = glTexture.height;
        
        const texWidth = source.pixelWidth;
        const texHeight = source.pixelHeight;

        const resWidth = source.resourceWidth;
        const resHeight = source.resourceHeight;

        if (resWidth < texWidth || resHeight < texHeight) {
            if (glWidth !== texWidth || glHeight !== texHeight){
                // 上传指定宽高的空纹理
                gl.texImage2D(
                    glTexture.target,
                    0,
                    glTexture.internalFormat,
                    texWidth,
                    texHeight,
                    0,
                    glTexture.format,
                    glTexture.type,
                    null
                );
            }

            // 上传纹理
            if (webglVersion === 2) {
                gl.texSubImage2D(
                    glTexture.target,
                    0,
                    0,
                    0,
                    resWidth,
                    resHeight,
                    glTexture.format,
                    glTexture.type,
                    source.resource
                );
            }else{
                gl.texSubImage2D(
                    glTexture.target,
                    0,
                    0,
                    0,
                    glTexture.format,
                    glTexture.type,
                    source.resource
                )
            }
        }else if (glWidth === texWidth || glHeight === texHeight){
            // 局部更新
            gl.texSubImage2D(
                glTexture.target,
                0,
                0,
                0,
                glTexture.format,
                glTexture.type,
                source.resource
            );
        }else if (webglVersion == 2){
            // webgl2 上传纹理
            gl.texImage2D(
                glTexture.target,
                0,
                glTexture.internalFormat,
                texWidth,
                texHeight,
                0,
                glTexture.format,
                glTexture.type,
                source.resource
            );
        }else{
            // webgl1 上传纹理
            gl.texImage2D(
                glTexture.target,
                0,
                glTexture.internalFormat,
                glTexture.format,
                glTexture.type,
                source.resource
            );
        }
        
        glTexture.width = texHeight;
        glTexture.height = texHeight;
    }
}