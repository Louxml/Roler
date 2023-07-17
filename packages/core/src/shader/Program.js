
import { PRECISION } from "../../../constants/src/index.js";
import { isMobile } from "../../../browser/src/isMobile.js";
import { defaultVertex, defaultFragment } from "./default/defaultProgram.js";
import { setPrecision } from "./utils/setPrecision.js";
import { getMaxFragmentPrecision } from "./utils/getMaxFragmentPrecision.js";

let UID = 0;

const nameCache = {};

export class Program{

    static defaultVertexPrecision = PRECISION.HIGH;

    static defaultFragmentPrecision = isMobile.apple.device ? PRECISION.HIGH : PRECISION.MEDIUM;

    /**
     * 唯一UID
     * @public
     */
    id;

    /**
     * 顶点着色器代码
     * @public
     */
    vertexSrc;

    /**
     * 片元着色器代码
     * @public
     */
    fragmentSrc;

    /**
     * WebGLProgram 对象字典
     */
    glPrograms;

    /**
     * attribute 数据
     * @public
     */
    attributeData;

    /**
     * uniform数据
     * @public
     */
    uniformData;

    // TODO extra 可添加拓展数据
    constructor(vertexSrc, fragmentSrc, name = "role-shader"){
        this.id = UID++;

        this.vertexSrc = vertexSrc || Program.defaultVertex;
        this.fragmentSrc = fragmentSrc || Program.defaultFragment;

        // 去掉首尾空白
        this.vertexSrc = this.vertexSrc.trim();
        this.fragmentSrc = this.fragmentSrc.trim();

        if (this.vertexSrc.substring(0, 8) != "#version"){
            name = name.replace(/\s+/g, '-');

            if (nameCache[name]){
                nameCache[name]++;
                name += `-${nameCache[name]}`;
            }else{
                nameCache[name] = 1;
            }

            this.vertexSrc = `#define SHADER_NAME ${name}\n\n${this.vertexSrc}`;
            this.fragmentSrc = `#define SHADER_NAME ${name}\n\n${this.fragmentSrc}`;

            this.vertexSrc = setPrecision(this.vertexSrc, Program.defaultVertexPrecision, PRECISION.HIGH);
            this.fragmentSrc = setPrecision(this.fragmentSrc, Program.defaultFragmentPrecision, getMaxFragmentPrecision())
        }

        this.glPrograms = {};
    }

    static get defaultVertex(){
        return defaultVertex;
    }

    static get defaultFragment(){
        return defaultFragment;
    }

    static from(vertexSrc, fragmentSrc, name){

        // TODO 可优化 将program缓存起来，避免重复创建，记得移除
        return new Program(vertexSrc, fragmentSrc, name)
    }
}