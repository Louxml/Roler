

export const glUploadBufferResource = {
    id: 'buffer',

    upload(source, glTexture, gl){
        
        if (glTexture.width === source.width || glTexture.height === source.height){
            gl.texSubImage2D(
                glTexture.target,
                0,
                0,
                0,
                source.width,
                source.height,
                glTexture.format,
                glTexture.type,
                source.resource
            );
        }else{
            gl.texImage2D(
                glTexture.target,
                0,
                glTexture.internalFormat,
                source.width,
                source.height,
                0,
                glTexture.format,
                glTexture.type,
                source.resource
            );
        }

        glTexture.width = source.width;
        glTexture.height = source.height;
    }
}