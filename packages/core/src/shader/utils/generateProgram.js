import { GLProgram } from "../GLProgram.js";
import { mapType } from "./mapType.js";


/**
 * 编译shader代码
 * @param {WebGLRenderingContext} gl 
 * @param {Number} type 类型 VERTEX_SHADER or FRAGMENT_SHADER
 * @param {String} src 源代码
 * @returns 
 */
function compileShader(gl, type, src){
    // console.log(src)
    const shader = gl.createShader(type);

    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    return shader;
}

/**
 * 获取program的attribute接口数据
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLProgram} program 
 */
function getAttributeData(gl, program){
    const attributes = {};
    const total = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < total; i++){
        const attribData = gl.getActiveAttrib(program, i);

        if (attribData.name.startsWith("gl_")){
            continue;
        }

        const data = {
            name: attribData.name,
            type: mapType(gl, attribData.type),
            size: attribData.size,
            index: i,
            location: gl.getAttribLocation(program, attribData.name)
        }

        attributes[data.name] = data;
    }

    return attributes;
}

/**
 * 获取program的unifrom接口数据
 * @param {WebGLRenderingContext} gl 
 * @param {WebGLProgram} program 
 */
function getUniformData(gl, program){
    const uniforms = {};

    const total = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < total; i++){
        const uniformData = gl.getActiveUniform(program, i);
        const name = uniformData.name.replace(/\[.*?\]$/, "");
        const isArray = !!uniformData.name.match(/\[.*?\]$/);

        // TODO 处理默认值
        uniforms[name] = {
            name,
            type: mapType(gl, uniformData.type),
            size:uniformData.size,
            index: i,
            isArray,
            location: gl.getUniformLocation(program, name)
        }
    }

    return uniforms;
}

// TODO 代码报错提示
function logPrettyShaderError(gl, shader)
{
    const shaderSrc = gl.getShaderSource(shader)
        .split('\n')
        .map((line, index) => `${index}: ${line}`);

    const shaderLog = gl.getShaderInfoLog(shader);
    const splitShader = shaderLog.split('\n');

    const dedupe = {};

    const lineNumbers = splitShader.map((line) => parseFloat(line.replace(/^ERROR\: 0\:([\d]+)\:.*$/, '$1')))
        .filter((n) =>
        {
            if (n && !dedupe[n])
            {
                dedupe[n] = true;

                return true;
            }

            return false;
        });

    const logArgs = [''];

    lineNumbers.forEach((number) =>
    {
        shaderSrc[number - 1] = `%c${shaderSrc[number - 1]}%c`;
        logArgs.push('background: #FF0000; color:#FFFFFF; font-size: 10px', 'font-size: 10px');
    });

    const fragmentSourceToLog = shaderSrc
        .join('\n');

    logArgs[0] = fragmentSourceToLog;

    console.error(shaderLog);

    // eslint-disable-next-line no-console
    console.groupCollapsed('click to view full shader code');
    console.warn(...logArgs);
    // eslint-disable-next-line no-console
    console.groupEnd();
}

function logProgramError(gl, program, vertexShader, fragmentShader)
{
    // if linking fails, then log and cleanup
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
        if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
        {
            logPrettyShaderError(gl, vertexShader);
        }

        if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS))
        {
            logPrettyShaderError(gl, fragmentShader);
        }

        console.error('PixiJS Error: Could not initialize shader.');

        // if there is a program info log, log it
        if (gl.getProgramInfoLog(program) !== '')
        {
            console.warn('PixiJS Warning: gl.getProgramInfoLog()', gl.getProgramInfoLog(program));
        }
    }
}


export function generateProgram(gl, program){
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, program.vertexSrc);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, program.fragmentSrc);

    const webGLProgram = gl.createProgram();

    gl.attachShader(webGLProgram, vertexShader);
    gl.attachShader(webGLProgram, fragmentShader);

    // TODO 处理transform feedback插件拓展

    gl.linkProgram(webGLProgram);

    // TODO 获取shader链接信息或者报错信息
    if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)){
        logProgramError(gl, webGLProgram, vertexShader, fragmentShader);
    }
    

    program.attributeData = getAttributeData(gl, webGLProgram);
    program.uniformData = getUniformData(gl, webGLProgram);

    // TODO 处理webgl2 的version 300


    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    // console.log(program);

    const glProgram = new GLProgram(webGLProgram, program.uniformData);

    // console.log(glProgram);

    return glProgram;

}