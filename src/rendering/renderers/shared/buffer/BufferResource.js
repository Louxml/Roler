
import { uid } from "../../../../utils/data/uid.js";
import { BindResource } from "../../gpu/shader/BindResource.js";

export class BufferResource extends BindResource {

    /**
     * @event change
     */


    #uid;

    buffer;

    #offset;

    #size;


    constructor({buffer, offset = 0, size = 0}){
        super('bufferResource');

        this.#uid = uid('buffer');

        this.buffer = buffer;
        this.#offset = offset | 0;
        this.#size = size;

        this.buffer.on('change', this.onBufferChange, this);
    }


    onBufferChange(){
        this._resourceId = uid('resource');

        this.emit('change', this);
    }

    destroy(destroyBuffer = false){
        this.destroyed = true;
        
        if (destroyBuffer){
            this.buffer.destroy();
        }

        this.emit('change', this);

        this.buffer.off('change', this.onBufferChange, this);
        this.buffer = null;
    }


    get uid(){
        return this.#uid;
    }

    get offset(){
        return this.#offset;
    }

    get size(){
        return this.#size;
    }

    get isBufferResource(){
        return true;
    }
}