import Node from "./Node.js";
import Mat3 from "../core/mat3.js";

class Camera extends Node{
    constructor(){
        super()
    }


    getViewMat3(){
        let globalRotate = function(p){
            if(p.parent == null){
                return p.rotation;
            }
            return globalRotate(p.parent) + p.rotation;
        }
        let rotate = -globalRotate(this);
        let trans = this.getModelMat3().data;

        trans = Mat3.multiply(new Mat3([
            Math.cos(rotate * Math.PI / 180), -Math.sin(rotate * Math.PI / 180), 0,
            Math.sin(rotate * Math.PI / 180), Math.cos(rotate * Math.PI / 180), 0,
            0, 0, 1
        ]), new Mat3([
            1, 0, -trans[2],
            0, 1, -trans[5],
            0, 0, 1
        ]))


        return trans;
    }
}

export default Camera;