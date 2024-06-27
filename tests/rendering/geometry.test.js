

import { Attribute } from "../../src/rendering/renderers/shared/geometry/Attribute.js";
import { Geometry } from "../../src/rendering/renderers/shared/geometry/Geometry.js";



function test1(){
    try {
        let geo = new Geometry({
            attributes:{
                position:[
                    1,1,0, //0
                    1,-1,0, //1
                    -1,-1,0, //2
                ],
                color:[1,0,0,0,1,0,0,0,1],
            },
            indexBuffer:[
                0,1,2,
            ]
        });
        console.log(geo);
        console.log(geo.getAttribute('position'))
        console.log(geo.getIndex())
        console.log(geo.getBuffer('position'))
        console.log(geo.getSize())
    } catch (error) {
        console.error(error);
    }
}

function test2(){
    let attr = new Attribute()
    let arr1 = new Attribute(attr);

    console.log(arr1 === attr)
}

// test1();

// test2()