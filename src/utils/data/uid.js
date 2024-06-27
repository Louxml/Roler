

const uidCache = {
    default: -1,
}

const uidTypes = [
    'default',
    'context',
    'buffer',
    'resource',
    'geometry',
]

/**
 * 获取uid
 * @param {String} name uid 类型
 * @returns Number uid
 */
export function uid(name = 'default'){
    if (!uidTypes.includes(name)){
        console.warn(`Invalid uid type: ${name}`);
    }

    uidCache[name] ??= -1;

    return ++uidCache[name];
}

/**
 * 重置uid
 * @param {String | Null} name uid 类型 为空则重置所有uid
 */
export function resetUid(name){
    if (name){
        delete uidCache[name];
    }else{
        for (const key in uidCache){
            delete uidCache[key];
        }
    }
}

/**
 * 获取所有uid缓存
 * @returns Object uid 缓存
 */
export function getUidCache(){
    return uidCache;
}