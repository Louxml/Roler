

/**
 * 剔除着色器代码中的版本信息: #version 300 es
 * @param {String} src 着色器代码
 * @param {Boolean} isES300 是否是es300
 */
export function stripVersion(src, isES300){
    if (!isES300) return src;

    return src.replace('#version 300 es', '');
}



/**
 * 检查着色器代码中是否包含精度
 * @param {String} src 着色器源代码
 * @param {Object} options 配置
 * @param {Boolean} isFragment 是否为片元着色器
 * @returns {String} 着色器源代码
 */
export function ensurePrecision(src, options, isFragment){
    const max = isFragment ? options.maxFragmentPrecision : options.maxVertexPrecision;
    let precision = isFragment ? options.fragmentPrecision : options.vertexPrecision;

    const matches = src.match(/precision (\w+)/g);

    if (max !== 'highp' && precision === 'highp'){
        precision = max;
    }

    if (matches && matches.length > 0){
        for (let i = 0; i < matches.length; i++){
            const match = matches[i];
            src = src.replace(match, `precision ${precision}`);
        }
    }else{
        src = `precision ${precision} float;\n${src}`;
    }

    return src;
}



/**
 * 添加着色器代码中的宏定义，兼容webgl1和webgl2
 * @param {String} src 着色器源代码
 * @param {Boolean} isES300 是否是es300
 * @param {Boolean} isFragment 是否是片元着色器
 * @returns {String} 着色器源代码
 */
export function addProgramDefines(src, isES300, isFragment){
    if (isES300) return src;

    if (isFragment){
        src = src.replace('out vec4 finalColor;', '');

        return `
#ifdef GL_ES    // This checks if it is WebGL1
#define in varying
#define finalColor gl_FragColor
#define texture texture2D

#endif
${src}`;
    }
    
    return `
#ifdef GL_ES    // This checks if it is WebGL1
#define in attribute
#define out varying

#endif
${src}`;
}


const fragmentNameCache = Object.create(null);
const vertexNameCache = Object.create(null);

/**
 * 设置着色器宏定义名字
 * @param {String} src 着色器源代码
 * @param {Object} options 配置
 * @param {Boolean} isFragment 是否是片元着色器
 * @returns {String} 着色器源代码
 */
export function setProgramName(src, options, isFragment){
    let name = options.name
    name = name.replace(/\s+/g, '');

    name += isFragment ? '-fragment' : '-vertex';

    const nameCache = isFragment ? fragmentNameCache : vertexNameCache;

    nameCache[name] ??= 0;

    nameCache[name]++;

    if (nameCache[name] > 1){
        name += `-${nameCache[name]}`;
    }

    if (src.indexOf('#define SHADER_NAME') !== -1)return src;

    return `
#define SHADER_NAME ${name}
${src}
    `;

}


/**
 * 插入版本信息
 * @param {String} src 着色器源代码
 * @param {Boolean} isES300 是否是es300
 * @returns {String} 着色器源代码
 */
export function insertVersion(src, isES300){
    if (!isES300) return src;

    return `#version 300 es\n${src}`;
}