

/**
 * 子系统抽象类
 */
export class System{

    #renderer;

    constructor(renderer){
        this.#renderer = renderer;
    }

    init(){

    }

    destroy(){

    }

    get renderer(){
        return this.#renderer;
    }
}