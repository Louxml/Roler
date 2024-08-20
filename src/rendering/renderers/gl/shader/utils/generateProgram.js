import { mapGLToVertexFormat, mapGLTypeFromFormat, mapType } from "./mapType.js";
import { logProgramError } from "./logProgramError.js";
import { getAttributeInfoFromFormat } from "./getAttributeInfoFromFormat.js";
import { defaultValue } from "./defaultValue.js";

import { GLProgramData } from "../GLProgramData.js";


/**
 * 获取uniform block信息
 * @param {WebGLProgram} program 
 * @param {WebGLRenderingContext} gl 
 * @returns 
 */
function getUboData(program, gl){
    if (!gl.ACTIVE_UNIFORM_BLOCKS) return {};

    const uniformBlocks = {};

    const totalUniformBlocks = gl.getProgramParameter(program, gl.ACTIVE_UNIFORM_BLOCKS);

    for (let i = 0; i < totalUniformBlocks; i++) {
        const name = gl.getActiveUniformBlockName(program, i);
        const blockIndex = gl.getUniformBlockIndex(program, name);
        const blockData = gl.getActiveUniformBlockParameter(program, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);

        const uniform = gl.getActiveUniformBlockParameter(program, blockIndex, gl.UNIFORM_BLOCK_ACTIVE_UNIFORMS);
        
        uniformBlocks[name] = {
            name,
            index: blockIndex,
            size: blockData,
        }
    }

    return uniformBlocks

}


/**
 * 导出UniformsData
 * @param {WebGLProgram} program 
 * @param {WebGLRenderingContext} gl 
 * @returns 
 */
function getUniformData(program, gl){
    const uniformsData = {};

    const totalUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);

    for (let i = 0; i < totalUniforms; i++) {
        const uniform = gl.getActiveUniform(program, i);

        // if (uniform.name.startsWith('gl_')) continue;

        const name = uniform.name.replace(/\[.*?\]/, '');

        const isArray = !!uniform.name.match(/\[.*?\]/);

        const type = mapType(gl, uniform.type);


        uniformsData[name] = {
            name,
            index: i,
            type,
            size: uniform.size,
            isArray,
            value: defaultValue(type, uniform.size),
        }
    }

    return uniformsData;
}

/**
 * 导出AttributesData
 * @param {WebGLProgram} program 
 * @param {WebGLRenderingContext} gl 
 * @param {Boolean} sortAttributes 属性值排序（升序）
 * @returns 
 */
function extractAttributesFromGLProgram(program, gl, sortAttributes){

    const attributes = {};

    // Attribute的数量
    const totalAttributes = gl.getProgramParameter(program, gl.ACTIVE_ATTRIBUTES);

    for (let i = 0; i < totalAttributes; i++) {
        const attribute = gl.getActiveAttrib(program, i);

        if (attribute.name.startsWith('gl_')) continue;

        const format = mapGLToVertexFormat(gl, attribute.type);

        const type = mapGLTypeFromFormat(format);

        const { size, stride, normalize } = getAttributeInfoFromFormat(format);

        attributes[attribute.name] = {
            location: i,    // 下面可能会重置
            format,
            type,
            size,
            stride,
            normalize,
            offset: 0,
            instance: false,
            start: 0,
        }
    }

    const keys = Object.keys(attributes);

    if (sortAttributes) {
        keys.sort((a, b) => (a > b ? 1 : -1));

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            gl.bindAttribLocation(program, i, key);
            attributes[key].location = i;
        }

        // 这里修改了绑定点，需要重新链接
        gl.linkProgram(program);
    }

    return attributes;
}


/**
 * 编译Shader代码
 * @param {WebGLRenderingContext} gl 
 * @param {Number} type 顶点着色器还是片元着色器
 * @param {String} src 源代码
 * @returns WebGLShader
 */
function compileShader(gl, type, src) {

    const shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    return shader;
}

/**
 * 编译shader代码，生成GLProgramData对象
 * @param {WebGLRenderingContext} gl 
 * @param {GLProgram} program 
 */
export function generateProgram(gl, program) {
    const glVertShader = compileShader(gl, gl.VERTEX_SHADER, program.vertex);
    const glFragShader = compileShader(gl, gl.FRAGMENT_SHADER, program.fragment);

    // 创建WebGLProgram，设置顶点和片元着色器
    const webGLProgram = gl.createProgram();
    gl.attachShader(webGLProgram, glVertShader);
    gl.attachShader(webGLProgram, glFragShader);

    // TODO program.transformFeedbackVaryings处理
    // const transformFeedbackVaryings = program.transformFeedbackVaryings;

    // if (transformFeedbackVaryings){
    //     if (typeof gl.transformFeedbackVaryings !== 'function') {
    //         throw new Error('WebGL2 required for transformFeedbackVaryings');
    //     }

    //     gl.transformFeedbackVaryings(
    //         webGLProgram,
    //         transformFeedbackVaryings.names,
    //         transformFeedbackVaryings.bufferMode === 'separate' ? gl.SEPARATE_ATTRIBS : gl.INTERLEAVED_ATTRIBS
    //     );
    // }

    // 链接
    gl.linkProgram(webGLProgram);


    if (!gl.getProgramParameter(webGLProgram, gl.LINK_STATUS)) {
        logProgramError(gl, webGLProgram, glVertShader, glFragShader);
    }

    // GLSL 3.00：不要重置attribute位置（绑定点），新的语法和功能会在shader代码指定
    program._attributeData = extractAttributesFromGLProgram(webGLProgram, gl, !(/^[ \t]*#[ \t]*version[ \t]+300[ \t]+es[ \t]*$/m).test(program.vertex));

    program._uniformData = getUniformData(webGLProgram, gl);

    program._uniformBlockData = getUboData(webGLProgram, gl);

    gl.deleteShader(glVertShader);
    gl.deleteShader(glFragShader);

    const uniformData = {};

    for (const name in program._uniformData) {
        const uniform = program._uniformData[name];

        uniformData[name] = {
            location: gl.getUniformLocation(webGLProgram, name),
            name,
            value: uniform.value,
        }
    }

    return new GLProgramData(webGLProgram, uniformData);
}