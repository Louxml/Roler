import Node from "./Node.js";
import Mat3 from "../core/mat3.js";

class Camera extends Node{
    constructor(){
        super()
    }


    getViewTransform(){
        let globalRotate = function(p){
            if(p.parent == null){
                return p.rotation;
            }
            return globalRotate(p.parent) + p.rotation;
        }
        let rotate = globalRotate(this);
        let trans = this.getWorldTransform().data;
        trans = new Mat3([
            Math.cos(rotate * Math.PI / 180), -Math.sin(rotate * Math.PI / 180), -trans[2],
            Math.sin(rotate * Math.PI / 180), Math.cos(rotate * Math.PI / 180), -trans[5],
            0, 0, 1
        ]);
        // console.log(trans)
        return trans;
    }
}

export default Camera;