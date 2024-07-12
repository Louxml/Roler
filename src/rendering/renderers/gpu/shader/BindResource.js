import { EventEmitter } from "../../../../eventemitter/EventEmtter.js";
import { uid } from "../../../../utils/data/uid.js";


export class BindResource extends EventEmitter {
    
    /**
     * 资源类型
     * @type {String}
     */
    #resourceType;

    /**
     * 资源id
     * @type {Number}
     */
    _resourceId;

    /**
     * 资源是否已销毁
     * @type {Boolean}
     */
    destroyed;

    constructor(type){
        super();

        this.#resourceType = type;
        this._resourceId = uid('resource');
        this.destroyed = false;
    }

    get resourceType(){
        return this.#resourceType;
    }

    get resourceId(){
        return this._resourceId;
    }
}