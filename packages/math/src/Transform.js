
import { Mat3 } from "./Mat3.js";
import { ObservableVec2 } from "./ObservableVec2.js";

export class Transform{
    worldTransform;

    localTransform;
    
    #position;

    #rotation = 0;
    
    #skew;
    
    #scale;

    #pivot;

    #currentLoaclID = 0;

    #localID = 0;

    #parentID = 0;

    _worldID = 0;

    get position(){
        return this.#position;
    }

    get rotation(){
        return this.#rotation;
    }

    get skew(){
        return this.#skew;
    }

    get scale(){
        return this.#scale;
    }

    get pivot(){
        return this.#pivot;
    }

    set rotation(v){
        if(this.#rotation === v)return;
        this.#rotation = v;
        this.onChange();
    }
     
    constructor(){
        this.worldTransform = new Mat3();
        this.localTransform = new Mat3();

        this.#position = new ObservableVec2(0, 0, this.onChange, this);
        this.#skew = new ObservableVec2(0, 0, this.onChange, this);
        this.#scale = new ObservableVec2(1, 1, this.onChange, this);
        this.#pivot = new ObservableVec2(0, 0, this.onChange, this);
        this.rotation = 0;
    }

    /**
     * 数值变动事件回调
     * @priavte
     */
    onChange(){
        // 矩阵更新
        this.#localID++;
        console.trace("Transform")
    }

    /**
     * 更新局部矩阵
     */
    updateLocalTransform(){
        if(this.#localID === this.#currentLoaclID)return;
        this.localTransform.setTransform(this.position.x, this.position.y, this.rotation, this.skew.x, this.skew.y, this.scale.x, this.scale.y, this.pivot.x, this.pivot.y);
        this.#currentLoaclID = this.#localID;
        // 强制更新全局矩阵
        this.#parentID = -1;
    }

    /**
     * 更新矩阵
     * @param {Transfrom} parentTransform 父级transform
     */
    updateTransform(parentTransform){
        this.updateLocalTransform()
        if(this.#parentID === parentTransform._worldID)return;
        this.worldTransform = parentTransform.clone().multiply(this.localTransform);
        this.#parentID = parentTransform._worldID;
        // 标记全局矩阵更新
        this._worldID++;
    }

    toString(){
        return `[@roler/math:Transform\n`
            + `\tposition=(${this.position.x}, ${this.position.y})\n`
            + `\trotation=${this.rotation} deg\n`
            + `\tscale=(${this.scale.x}, ${this.scale.y})\n`
            + `\tskew=(${this.skew.x}, ${this.skew.y})\n`
            + `\tpivot=(${this.pivot.x}, ${this.pivot.y})\n`
            + `]`;
    }
}