

export const defaultVertex = `
attribute vec2 a_vertexPosition;
attribute vec2 a_textureCoord;

uniform mat3 u_projectMatrix;
varying vec2 v_textureCoord;

void main(){
    gl_Position = vec4((u_projectMatrix * vec3(a_vertexPosition, 1.0)).xy, 0.0, 1.0);
    v_textureCoord = a_textureCoord;
}
`

export const defaultFragment = `
varying vec2 v_textureCoord;

uniform sampler2D u_sampler;

void main(){
    gl_FragColor = texture2D(u_sampler, v_textureCoord);
}
`