import { uniformParsers } from "../../shader/utils/uniformParsers.js";



export function createUboSyncFunction(uboElements, parserCode, arrayGenerationFunction, singleSettersMap){

    const funcFragments = [`
        var v = null;
        var v2 = null;
        var t = 0;
        var index = 0;
        var name = null;
        var arrayOffset = null;
    `]

    let prev = 0;
    for (let i = 0; i < uboElements.length; i++){
        const uboElement = uboElements[i];
        const name = uboElement.data.name;

        // 是否适配
        let parsed = false;
        let offset = 0;
        for (const uniformParser of uniformParsers){
            if (uniformParser.test(uboElement.data)){
                parsed = true;

                funcFragments.push(
                    `name = "${name}";`,
                    `offset += ${offset - prev};`,
                    uniformParser[parserCode] || uniformParser.ubo
                )

                break;
            }
        }

        // 未适配处理
        if (!parsed){
            if (uboElement.data.size > 1){
                // TODO 这里为什么除以4
                offset = uboElement.offset / 4;

                funcFragments.push(
                    arrayGenerationFunction(uboElement, offset - prev)
                )
            }else{
                const temp = singleSettersMap[uboElement.data.type];

                // TODO 这里为什么除以4
                offset = uboElement.offset / 4;

                funcFragments.push(`
                    v = uv.${name};
                    offset += ${offset - prev};
                    ${temp}
                `);
            }
        }

        prev = offset;
    }

    const fragmentSrc = funcFragments.join('\n');

    console.log(fragmentSrc);

    return new Function('uv', 'data', 'offset', fragmentSrc);
}