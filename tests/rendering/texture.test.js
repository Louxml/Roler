import { Texture } from "../../src/rendering/renderers/shared/texture/Texture.js";
import { TextureSource } from "../../src/rendering/renderers/shared/texture/sources/TextureSource.js";



function  test1(){

    // var t = new Texture({
    //     label:'test',
    //     source:new TextureSource({
    //         label:'test1',
    //         width: 100,
    //         height: 200
    //     })
    // });
    let t = Texture.WHITE;
    // let t = new TextureSource();

    console.log(t)
}



// test1();