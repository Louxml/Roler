import { uid } from "../../../../utils/data/uid.js";
import { BindResource } from "../../gpu/shader/BindResource.js";
import { generateIdFromString } from "../../utils/generateIdFromString.js";
import { UNIFORM_TYPSE_VALUES } from "./types.js";
import { getDefaultUniformValue } from "./utils/getDefaultUniformValue.js";


export class UniformGroup extends BindResource {
    
    static defaultOptions = {
        ubo: false,
        isStatic: false,
    }

    /**
     * 更新状态
     * @type {Number}
     */
    #updateID;

    /**
     * 唯一标识符
     * @type {Number}
     */
    #uid;

    /**
     * uniformGroup结构
     * @type {Object}
     */
    uniformStructures;

    /**
     * uniformGroup数据
     */
    uniforms;

    /**
     * 是否是ubo
     * @type {Boolean}
     */
    ubo;

    /**
     * 是否是静态的
     * @type {Boolean}
     */
    isStatic;

    /**
     * 签名
     * @type {Number}
     */
    #signature;


    constructor(uniformStructures, options){
        super('uniformGroup');

        options = {...UniformGroup.defaultOptions, ...options};

        this.#uid = uid('uniform');

        // uniform
        this.uniformStructures = uniformStructures;

        const uniforms = {};


        for (const i in uniformStructures) {
            const uniformData = uniformStructures[i];

            uniformData.name = i;
            uniformData.size ??= 1;

            if (!UNIFORM_TYPSE_VALUES.includes(uniformData.type)) {
                throw new Error(`Uniform type ${uniformData.type} is not supported`);
            }

            uniformData.value ??= getDefaultUniformValue(uniformData.type, uniformData.size);

            uniforms[i] = uniformData.value;
        }

        this.uniforms = uniforms;

        this.ubo = options.ubo;
        this.isStatic = options.isStatic;

        this.#updateID = 1;

        const keys = Object.keys(uniforms).map(i => `${i}-${uniformStructures[i].type}`);
        this.#signature = generateIdFromString(keys.join('|'), 'uniform-group');
    }

    update(){
        this.#updateID++;
    }

    get uid(){
        return this.#uid;
    }

    get signature(){
        return this.#signature;
    }

    get updateID(){
        return this.#updateID;
    }

    get isUniformGroup(){
        return true;
    }
}