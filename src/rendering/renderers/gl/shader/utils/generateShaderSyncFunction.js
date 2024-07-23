import { BufferResource } from "../../../shared/buffer/BufferResource.js";
import { UniformGroup } from "../../../shared/shader/UniformGroup.js";

import '../../../shared/buffer/BufferResource.js';


export function generateShaderSyncFunction(shader, shaderProgram) {
    
    const funcFragments = [];

    /**
     * r = renderer
     * s = shader
     * g = shader.groups
     * sS = ShaderSystem
     * p = GLProgram
     * ugs = UniformGroupSystem
     */
    const headerFragment = [`
        var g = s.groups;
        var sS = r.shader;
        var p = s.glProgram;
        var ugs = r.uniformGroup;
        var resources;
    `];

    let blockIndex = 0;

    const programData = shaderProgram._getProgramData(shader.glProgram);

    for (const i in shader.groups){
        // BindGroup对象
        const group = shader.groups[i];

        funcFragments.push(`
            resources = g[${i}].resources;
        `);

        // console.log(group)

        for (const j in group.resources){
            const resource = group.resources[j];

            if (resource instanceof UniformGroup){
                if (resource.ubo){
                    // TODO ubo
                    funcFragments.push(`
                        sS.bindUniformBlock(resources[${j}], s._uniformBindMap[${i}][${j}], ${blockIndex++});
                    `);
                }else{
                    funcFragments.push(`
                        ugs.updateUniformGroup(resources[${j}], p, sD);
                    `);
                }
            }else if (resource instanceof BufferResource){
                // TODO BufferResource
                funcFragments.push(`
                    sS.bindUniformBlock(resources[${j}], s._uniformBindMap[${i}][${j}], ${blockIndex++});
                `);
            }else if (resource instanceof TextureResource){
                // TODO TextureResource
            }
        }
    }


    const functionSource = [...headerFragment, ...funcFragments].join('\n');

    // console.log(functionSource);

    return new Function('r', 's', 'sD', functionSource);
}