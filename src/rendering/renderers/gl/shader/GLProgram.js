import { generateIdFromString } from "../../utils/generateIdFromString.js";
import { getMaxFragmentPrecision } from "./utils/getMaxFragmentPrecision.js";
import { stripVersion, ensurePrecision, addProgramDefines, setProgramName, insertVersion } from "./utils/preprocessors.js";



const programCache = Object.create(null);


/**
 * 源代码处理流程
 */
const processes = {
    stripVersion,
    ensurePrecision,
    addProgramDefines,
    setProgramName,
    insertVersion,
}


export class GLProgram {
    
    static defaultOptions = {
        /**
         * GLSL 片元着色器代码
         * @type {string}
         */
        fragment: '',
        /**
         * GLSL 顶点着色器代码
         * @type {string}
         */
        vertex: '',
        /**
         * GLProgram 名称
         * @type {string}
         */
        name: '',
        /**
         * GLProgram 顶点着色器精度
         * @type {string}
         */
        preferredVertexPrecision: 'highp',
        /**
         * GLProgram 片元着色器精度
         * @type {string}
         */
        preferredFragmentPrecision: 'mediump',

        /**
         * transform feedback varyings
         */
        transformFeedbackVaryings: {names: [], bufferMode: 'interleaved'}
    }

    /**
     * GLSL 片元着色器代码
     * @type {string}
     */
    #fragment;

    /**
     * GLSL 顶点着色器代码
     * @type {string}
     */
    #vertex;

    /**
     * GLProgram 唯一标识
     */
    #key;

    /**
     * attribute 数据格式
     */
    _attributeData;

    /**
     * uniform 数据格式
     */
    _uniformData;

    /**
     * uniform block 数据格式
     */
    _uniformBlockData;

    /**
     * transform feedback varyings 数据
     */
    transformFeedbackVaryings;
    

    constructor(options){
        options = {...GLProgram.defaultOptions, ...options};

        const isES300 = (options.fragment.indexOf('#version 300 es') !== -1) || (options.vertex.indexOf('#version 300 es') !== -1);

        const preprocessorOptions = {
            stripVersion: isES300,
            ensurePrecision: {
                fragmentPrecision: options.preferredFragmentPrecision,
                vertexPrecision: options.preferredVertexPrecision,
                maxVertexPrecision: 'highp',
                maxFragmentPrecision: getMaxFragmentPrecision(),
            },
            setProgramName: {
                name: options.name,
            },
            addProgramDefines: isES300,
            insertVersion: isES300,
        };

        let { vertex, fragment } = options;

        // 处理源代码
        Object.keys(processes).forEach(key => {
            const process = processes[key];

            const options = preprocessorOptions[key];

            fragment = process(fragment, options, true);
            vertex = process(vertex, options, false);

        });

        this.#fragment = fragment;
        this.#vertex = vertex;

        this.transformFeedbackVaryings = options.transformFeedbackVaryings;
        
        this.#key = generateIdFromString(`${vertex}:${fragment}`, 'gl-program');
    }

    get key(){
        return this.#key;
    }

    get fragment(){
        return this.#fragment;
    }

    get vertex(){
        return this.#vertex;
    }

    destroy(){
        this.#vertex = null;
        this.#fragment = null;

        this._attributeData = null;
        this._uniformData = null;
    }

    /**
     * 创建GLProgram
     * @param {GLProgramOptions} options 配置
     * @returns GLProgram
     */
    static from(options){
        const key = `${options.vertex}:${options.fragment}`;

        return programCache[key] || (programCache[key] = new GLProgram(options));

    }
}