import { BufferResource } from "../../../shared/buffer/BufferResource.js";
import { UniformGroup } from "../../../shared/shader/UniformGroup.js";

import '../../../shared/buffer/BufferResource.js';
import { TextureSource } from "../../../shared/texture/sources/TextureSource.js";


export function generateShaderSyncFunction(shader, shaderSystem) {
    
    const funcFragments = [];

    /**
     * r = renderer
     * s = shader
     * g = shader.groups
     * sS = ShaderSystem
     * p = GLProgram
     * ugs = UniformGroupSystem
     * tS = TextureSystem
     */
    const headerFragment = [`
        var g = s.groups;
        var sS = r.shader;
        var p = s.glProgram;
        var ugs = r.uniformGroup;
        var tS = r.texture;
        var resources;
    `];

    let blockIndex = 0;
    let textureCount = 0;

    // GLProgram对象
    const programData = shaderSystem._getProgramData(shader.glProgram);

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
                funcFragments.push(`
                    sS.bindUniformBlock(resources[${j}], s._uniformBindMap[${i}][${j}], ${blockIndex++});
                `);
            }else if (resource instanceof TextureSource){
                const uniformName = shader._uniformBindMap[i][j];

                const uniformData = programData.uniformData[uniformName];
                
                if (uniformData){
                    // 这里纹理直接上传了？不用异步吗,记得有个地方有纹理上传逻辑代码
                    // 还是这里只上传索引？
                    // shaderSystem.gl.uniform1i(uniformData.location, textureCount);

                    funcFragments.push(`
                        tS.bind(resources[${j}], ${textureCount});
                    `);

                    textureCount++;
                }
            }else{
                console.warn('Unknown resource type', resource);
            }
        }
    }


    const functionSource = [...headerFragment, ...funcFragments].join('\n');

    // console.log(functionSource);

    return new Function('r', 's', 'sD', functionSource);
}