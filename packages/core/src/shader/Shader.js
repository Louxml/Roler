
import { Runner } from "../../../runner/src/index.js";
import { Program } from "./Program.js";
import { UniformGroup } from "./UniformGroup.js";

export class Shader{

    /**
     * Shader Program对象
     * @public
     */
    program;

    /**
     * uniformGroup 对象
     * @public
     */
    uniformGroup;

    /**
     * 处理运行器
     * @private
     */
    disposeRunner;

    constructor(program, uniforms){
        this.program = program;

        if (uniforms){
            if (uniforms instanceof UniformGroup){
                this.uniformGroup = uniforms;
            }else{
                this.uniformGroup = new UniformGroup(uniforms);
            }
        }else{
            this.uniformGroup = new UniformGroup({});
        }

        this.disposeRunner = new Runner("dispose");
    }

    destroy(){
        this.uniformGroup = null;

        this.disposeRunner.emit(this);
        this.disposeRunner.destroy();
    }

    get uniforms(){
        return this.uniformGroup.uniforms;
    }

    /**
     * 创建一个Shader对象
     * @param {String} vertexSrc 顶点着色器代码
     * @param {String} fragmentSrc 片元着色器代码
     * @param {Object} uniforms uniform字典对象
     * @static
     * @public
     * @returns Shader 对象
     */
    static from(vertexSrc, fragmentSrc, uniforms){
        const program = new Program(vertexSrc, fragmentSrc);

        return new Shader(program, uniforms);
    }
}