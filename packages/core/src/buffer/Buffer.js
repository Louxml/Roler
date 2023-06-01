
import { BUFFER_TYPE } from "../../../constants/src/index.js";
import { Runner } from "../../../runner/src/Runner.js";

let UID = 0;

export class Buffer{

    /**
     * 数据
     * @Array
     * @public
     */
    data;

    /**
     * 静态
     * @Boolean
     * @public
     */
    static;

    /**
     * buffer类型
     * @type {BUFFER_TYPE}
     * @public
     */
    type;

    /**
     * 更新标记
     * @Number
     * @priavte
     */
    #updateID;

    /**
     * 处理Buffer 运行器
     * @Runner
     * @public
     */
    disposeRunner;

    constructor(data, _static = true, index = false){
        this.data = data || new Float32Array(1);

        this.glBuffer = {};
        this.#updateID = 0;
        
        this.static = _static;
        this.index = index;

        this.id = UID++;

        this.disposeRunner = new Runner('dispose');
    }
    
    /**
     * 更新Buffer数据
     * @param {number[] | Float32Array} data 数据
     */
    update(data = this.data){
        if (data instanceof Array){
            data = new Float32Array(data);
        }
        this.data = data;
        this.#updateID++;
    }

    /**
     * 处置buffer（将会从buffersystem中移除）
     */
    dispose(){
        this.disposeRunner.emit(this, false);
    }

    destroy(){
        this.dispose();

        this.data = null;
    }

    get updateID(){
        return this.#updateID;
    }

    get index(){
        return this.type === BUFFER_TYPE.ELEMENT_ARRAY_BUFFER;
    }

    set index(value){
        this.type = value ? BUFFER_TYPE.ELEMENT_ARRAY_BUFFER : BUFFER_TYPE.ARRAY_BUFFER;
    }

    static from(data = []){
        if (data instanceof Array){
            data = new Float32Array(data);
        }

        return new Buffer(data);
    }
}