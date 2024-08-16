

import { ExtensionType } from "../../../../extensions/index.js";
import { System } from "../../shared/system/System.js";


export class GLColorMaskSystem extends System {
    
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'colorMask'
    }

    #colorMaskCache = 0b1111;

    contextChange(){
        console.log('GLColorMaskSystem init');
    }


    /**
     * 设置颜色掩码,开启颜色分量
     * @param {Number} colorMask 开启的颜色分量，二进制掩码，0表示关闭，1表示开启
     */
    setMask(colorMask){
        if (colorMask === this.#colorMaskCache) return;

        this.#colorMaskCache = colorMask;
        this.renderer.gl.colorMask(
            !!(colorMask & 0b1000),
            !!(colorMask & 0b0100),
            !!(colorMask & 0b0010),
            !!(colorMask & 0b0001)
        )
    }
}