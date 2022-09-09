import { Mat3 } from "./Mat3.js";

export class Transform{
    #worldTransform;

    #localTransform;
    
    #position;

    #rotation;
    
    #skew;
    
    #scale;

    #pivot;

    #currentLoaclID;

    #localID;

    #parentID;

    _worldID;
     
    constructor(){
        this.#worldTransform = new Mat3();
        this.#localTransform = new Mat3();
        
    }
}