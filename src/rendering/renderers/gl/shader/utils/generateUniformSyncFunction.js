import { commonArrayUniformParsers, commonSingleUniformParsers, uniformParsers } from "../../../shared/shader/utils/uniformParsers.js";



export function generateUniformSyncFunction(group, uniformData){

    const funcFragments = [`
        var gl = r.gl;
    `];

    for (const name in group.uniforms){

        // glProgram中没有这个uniform
        if (!uniformData[name]){
            // Pixi是打算再绑定UniformGroup或者BufferResource的时候，再同步UniformData，这里暂时跳过
            // 我觉得这里可优化成不处理，看是什么原因导致需要再次绑定
            continue;
        }

        
        funcFragments.push(`
        var name = "${name}";
        `)


        const uniform = group.uniformStructures[name];

        let parsed = false;

        for (const i in uniformParsers){
            const parser = uniformParsers[i];
            if (parser.type === uniform.type && parser.test(uniform)){
                funcFragments.push(parser.uniform);
                parsed = true;
            }
        }

        // 通用数据处理
        if (!parsed){
            const parsers = uniform.size === 1 ? commonSingleUniformParsers : commonArrayUniformParsers;
            const parser = parsers[uniform.type];

            if (!parser){
                throw new Error(`Unsupported uniform type: ${uniform.type}`);
            }

            funcFragments.push(parser);
        }
    }

    const functionSource = funcFragments.join('\n');

    // console.log(functionSource)

    return new Function('ud', 'uv', 'r', 'sd', functionSource);
}