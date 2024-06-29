

export class BindResource {
    
    /**
     * 资源类型
     * @type {String}
     */
    #resourceType;

    /**
     * 资源id
     * @type {Number}
     */
    #resourceId;

    /**
     * 资源是否已销毁
     * @type {Boolean}
     */
    destroyed;

    on(event, callback, bindGroup){}

    off(event, callback, bindGroup){}

    get resourceType(){
        return this.#resourceType;
    }

    get resourceId(){
        return this.#resourceId;
    }
}