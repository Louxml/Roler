


import { Texture } from "../Texture.js";
import { CanvasSource } from "../sources/CanvasSource.js";

// 画布缓存，用于存储已经创建过的纹理，key：canvas，value：texture
const canvasCache = new Map();


/**
 * 获取画布的纹理
 * @param {HTMLCanvasElement} canvas 
 * @param {Object} options 纹理配置
 * @returns 
 */
export function getCanvasTexture(canvas, options) {
    if (!canvasCache.has(canvas)){
        const texture = new Texture({
            source: new CanvasSource({
                resource: canvas,
                ...options
            })
        });

        const onDestroy = () => {
            if (canvasCache.has(canvas)){
                canvasCache.delete(canvas);
            }
        }


        texture.once("destroy", onDestroy);
        texture.source.once("destroy", onDestroy);

        canvasCache.set(canvas, texture);
    }

    return canvasCache.get(canvas);
}