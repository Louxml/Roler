import { Extension, ExtensionType } from "../extensions/index.js";


const environments = [];

Extension.handleByNamedList(ExtensionType.Environment, environments);


/**
 * 自动检测环境添加拓展
 * @param {Boolean} skip 是否跳过添加拓展
 * @returns 
 */
export async function loadEnvironmentExtensions(skip){
    if (skip) return;

    for (let i = 0; i < environments.length; i++){
        const env = environments[i];
        
        if (env.value.test()){
            await env.value.load();
            return;
        }
    }
}

/**
 * 自动检测环境添加拓展
 * @param {Boolean} add 是否添加
 * @returns 
 */
export async function autoDetectEnvironment(add){
    return await loadEnvironmentExtensions(!add);
}