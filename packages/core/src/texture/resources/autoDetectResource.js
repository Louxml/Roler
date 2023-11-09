import { Resource, ResourcePlugins } from "./index.js";

/**
 * 
 * @param {*} source 资源
 * @param {Object} [options] 配置
 * @param {Number} [options.width]  宽度
 * @param {Number} [options.height] 高度
 * @param {Boolean} [options.autoLoad = true] 自动加载
 * @param {Number} [options.scale]  缩放
 * @param {}
 * @returns {Resource}
 */
export function autoDetectResource(source, options){
    if (!source)return null;

    let extension = "";

    if (typeof source === "string"){
        const result = (/\.(\w{2,4})(?:$|\?|#)/i).exec(source);

        if (result){
            extension = result[1].toLowerCase();
        }
    }

    for (let i = ResourcePlugins.length - 1; i >= 0; --i){
        const ResourcePlugin = ResourcePlugins[i];
        if (ResourcePlugin.test?.(source, extension)){
            return new ResourcePlugin(source, options);
        }
    }

    throw new Error(`Not Support Resource`);
}