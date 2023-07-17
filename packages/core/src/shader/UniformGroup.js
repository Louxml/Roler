
import { BUFFER_TYPE } from "../../../constants/src/index.js";
import { Buffer } from "../buffer/Buffer.js";

let UID = 0;

export class UniformGroup{


    /**
     * UID
     * @public
     */
    id;

    #uniforms;

    /**
     * 更新UID
     */
    #updateID;

    /**
     * 是否静态
     * @public
     */
    static;

    /**
     * 同步uniformcallback
     * @public
     */
    syncUniforms;

    ubo;
    
    buffer;

    autoManage;

    constructor(uniforms, isStatic, isUbo){

        this.syncUniforms = {};
        
        this.#updateID = 0;
        this.id = UID++;
        this.static = !!isStatic;
        this.ubo = !!isUbo;

        if (uniforms instanceof Buffer){
            this.buffer = uniforms;
            this.buufer.type = BUFFER_TYPE.UNIFORM_BUFFER;
            this.autoManage = false;
            this.ubo = true;
        }else{
            this.#uniforms = uniforms;
            if (this.ubo){
                this.buffer = new Buffer(new Float32Array(1));
                this.buffer.type = BUFFER_TYPE.UNIFORM_BUFFER;
                this.autoManage = true;
            }
        }
    }

    update(){
        this.#updateID++;
        if (!this.autoManage && this.buffer){
            this.buffer.update();
        }
    }

    add(name, uniforms, isStatic){
        if (!this.ubo){
            this.#uniforms[name] = new UniformGroup(uniforms, isStatic);
        }else{
            throw new Error("ubo模式下禁止修改数据")
        }
    }

    get uniforms(){
        return this.#uniforms;
    }

    get updateID(){
        return this.#updateID;
    }

    static from(uniforms, isStatic, isUbo){
        return new UniformGroup(uniforms, isStatic, isUbo);
    }

    static uboFrom(uniforms, isStatic){
        return new UniformGroup(uniforms, isStatic ?? true, true);
    }
}