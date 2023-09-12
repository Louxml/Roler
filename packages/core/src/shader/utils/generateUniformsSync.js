

const uniformParsers = [

    // a float cache layer
    {
        test: (data) =>
            data.type === 'float' && data.size === 1 && !data.isArray,
        code: (name) =>
            `
            if(uv["${name}"] !== ud["${name}"].value)
            {
                ud["${name}"].value = uv["${name}"]
                gl.uniform1f(ud["${name}"].location, uv["${name}"])
            }
            `,
    },
    // handling samplers
    {
        test: (data, uniform) =>
            // eslint-disable-next-line max-len,no-eq-null,eqeqeq
            (data.type === 'sampler2D' || data.type === 'samplerCube' || data.type === 'sampler2DArray') && data.size === 1 && !data.isArray && (uniform == null || uniform.castToBaseTexture !== undefined),
        code: (name) => `t = syncData.textureCount++;

            renderer.texture.bind(uv["${name}"], t);

            if(ud["${name}"].value !== t)
            {
                ud["${name}"].value = t;
                gl.uniform1i(ud["${name}"].location, t);\n; // eslint-disable-line max-len
            }`,
    },
    // uploading pixi matrix object to mat3
    {
        test: (data, uniform) =>
            data.type === 'mat3' && data.size === 1 && !data.isArray && uniform.data !== undefined,
        code: (name) =>

            // TODO and some smart caching dirty ids here!
            `
            gl.uniformMatrix3fv(ud["${name}"].location, false, uv["${name}"].data);
            `,
        codeUbo: (name) =>
            `
                var ${name}_matrix = uv.${name}.toArray(true);

                data[offset] = ${name}_matrix[0];
                data[offset+1] = ${name}_matrix[1];
                data[offset+2] = ${name}_matrix[2];
        
                data[offset + 4] = ${name}_matrix[3];
                data[offset + 5] = ${name}_matrix[4];
                data[offset + 6] = ${name}_matrix[5];
        
                data[offset + 8] = ${name}_matrix[6];
                data[offset + 9] = ${name}_matrix[7];
                data[offset + 10] = ${name}_matrix[8];
            `
        ,

    },
    // uploading a pixi point as a vec2 with caching layer
    {
        test: (data, uniform) =>
            data.type === 'vec2' && data.size === 1 && !data.isArray && uniform.x !== undefined,
        code: (name) =>
            `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v.x || cv[1] !== v.y)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    gl.uniform2f(ud["${name}"].location, v.x, v.y);
                }`,
        codeUbo: (name) =>
            `
                v = uv.${name};

                data[offset] = v.x;
                data[offset+1] = v.y;
            `
    },
    // caching layer for a vec2
    {
        test: (data) =>
            data.type === 'vec2' && data.size === 1 && !data.isArray,
        code: (name) =>
            `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v[0] || cv[1] !== v[1])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    gl.uniform2f(ud["${name}"].location, v[0], v[1]);
                }
            `,
    },
    // upload a pixi rectangle as a vec4 with caching layer
    {
        test: (data, uniform) =>
            data.type === 'vec4' && data.size === 1 && !data.isArray && uniform.width !== undefined,

        code: (name) =>
            `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)
                {
                    cv[0] = v.x;
                    cv[1] = v.y;
                    cv[2] = v.width;
                    cv[3] = v.height;
                    gl.uniform4f(ud["${name}"].location, v.x, v.y, v.width, v.height)
                }`,
        codeUbo: (name) =>
            `
                    v = uv.${name};

                    data[offset] = v.x;
                    data[offset+1] = v.y;
                    data[offset+2] = v.width;
                    data[offset+3] = v.height;
                `
    },
    // upload a pixi color as vec4 with caching layer
    {
        test: (data, uniform) =>
            data.type === 'vec4' && data.size === 1 && !data.isArray && uniform.red !== undefined,

        code: (name) =>
            `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.alpha)
                {
                    cv[0] = v.red;
                    cv[1] = v.green;
                    cv[2] = v.blue;
                    cv[3] = v.alpha;
                    gl.uniform4f(ud["${name}"].location, v.red, v.green, v.blue, v.alpha)
                }`,
        codeUbo: (name) =>
            `
                    v = uv.${name};

                    data[offset] = v.red;
                    data[offset+1] = v.green;
                    data[offset+2] = v.blue;
                    data[offset+3] = v.alpha;
                `
    },
    // upload a pixi color as a vec3 with caching layer
    {
        test: (data, uniform) =>
            data.type === 'vec3' && data.size === 1 && !data.isArray && uniform.red !== undefined,

        code: (name) =>
            `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v.red || cv[1] !== v.green || cv[2] !== v.blue || cv[3] !== v.a)
                {
                    cv[0] = v.red;
                    cv[1] = v.green;
                    cv[2] = v.blue;
    
                    gl.uniform3f(ud["${name}"].location, v.red, v.green, v.blue)
                }`,
        codeUbo: (name) =>
            `
                    v = uv.${name};

                    data[offset] = v.red;
                    data[offset+1] = v.green;
                    data[offset+2] = v.blue;
                `
    },

    // a caching layer for vec4 uploading
    {
        test: (data) =>
            data.type === 'vec4' && data.size === 1 && !data.isArray,
        code: (name) =>
            `
                cv = ud["${name}"].value;
                v = uv["${name}"];

                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
                {
                    cv[0] = v[0];
                    cv[1] = v[1];
                    cv[2] = v[2];
                    cv[3] = v[3];

                    gl.uniform4f(ud["${name}"].location, v[0], v[1], v[2], v[3])
                }`,
    },
];



const GLSL_TO_SINGLE_SETTERS_CACHED = {

    float: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1f(location, v);
    }`,

    vec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2f(location, v[0], v[1])
    }`,

    vec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3f(location, v[0], v[1], v[2])
    }`,

    vec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4f(location, v[0], v[1], v[2], v[3]);
    }`,

    int: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
    ivec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
    ivec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
    ivec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,

    uint: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1ui(location, v);
    }`,
    uvec2: `
    if (cv[0] !== v[0] || cv[1] !== v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2ui(location, v[0], v[1]);
    }`,
    uvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3ui(location, v[0], v[1], v[2]);
    }`,
    uvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4ui(location, v[0], v[1], v[2], v[3]);
    }`,

    bool: `
    if (cv !== v)
    {
        cu.value = v;
        gl.uniform1i(location, v);
    }`,
    bvec2: `
    if (cv[0] != v[0] || cv[1] != v[1])
    {
        cv[0] = v[0];
        cv[1] = v[1];

        gl.uniform2i(location, v[0], v[1]);
    }`,
    bvec3: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];

        gl.uniform3i(location, v[0], v[1], v[2]);
    }`,
    bvec4: `
    if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])
    {
        cv[0] = v[0];
        cv[1] = v[1];
        cv[2] = v[2];
        cv[3] = v[3];

        gl.uniform4i(location, v[0], v[1], v[2], v[3]);
    }`,

    mat2:     'gl.uniformMatrix2fv(location, false, v)',
    mat3:     'gl.uniformMatrix3fv(location, false, v)',
    mat4:     'gl.uniformMatrix4fv(location, false, v)',

    sampler2D: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
    samplerCube: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
    sampler2DArray: `
    if (cv !== v)
    {
        cu.value = v;

        gl.uniform1i(location, v);
    }`,
};

const GLSL_TO_ARRAY_SETTERS = {

    float:    `gl.uniform1fv(location, v)`,

    vec2:     `gl.uniform2fv(location, v)`,
    vec3:     `gl.uniform3fv(location, v)`,
    vec4:     'gl.uniform4fv(location, v)',

    mat4:     'gl.uniformMatrix4fv(location, false, v)',
    mat3:     'gl.uniformMatrix3fv(location, false, v)',
    mat2:     'gl.uniformMatrix2fv(location, false, v)',

    int:      'gl.uniform1iv(location, v)',
    ivec2:    'gl.uniform2iv(location, v)',
    ivec3:    'gl.uniform3iv(location, v)',
    ivec4:    'gl.uniform4iv(location, v)',

    uint:     'gl.uniform1uiv(location, v)',
    uvec2:    'gl.uniform2uiv(location, v)',
    uvec3:    'gl.uniform3uiv(location, v)',
    uvec4:    'gl.uniform4uiv(location, v)',

    bool:     'gl.uniform1iv(location, v)',
    bvec2:    'gl.uniform2iv(location, v)',
    bvec3:    'gl.uniform3iv(location, v)',
    bvec4:    'gl.uniform4iv(location, v)',

    sampler2D:      'gl.uniform1iv(location, v)',
    samplerCube:    'gl.uniform1iv(location, v)',
    sampler2DArray: 'gl.uniform1iv(location, v)',
};

// console.log(uniformParsers)

export function generateUniformsSync(group, uniformData){
    const funcFragments = [`
        var v = null;
        var cv = null;
        var cu = null;
        var t = 0;
        var gl = renderer.gl;
    `];

    for (const i in group.uniforms)
    {
        const data = uniformData[i];


        if (!data)
        {
            if (group.uniforms[i].uniforms)
            {
                if (group.uniforms[i].ubo)
                {
                    funcFragments.push(`
                        renderer.shader.syncUniformBufferGroup(uv.${i}, '${i}');
                    `);
                }
                else
                {
                    funcFragments.push(`
                        renderer.shader.syncUniformGroup(uv.${i}, syncData);
                    `);
                }
            }

            continue;
        }

        const uniform = group.uniforms[i];

        let parsed = false;

        for (let j = 0; j < uniformParsers.length; j++)
        {
            if (uniformParsers[j].test(data, uniform))
            {
                funcFragments.push(uniformParsers[j].code(i, uniform));
                parsed = true;

                break;
            }
        }

        if (!parsed)
        {
            const templateType = data.size === 1 && !data.isArray ? GLSL_TO_SINGLE_SETTERS_CACHED : GLSL_TO_ARRAY_SETTERS;
            const template = templateType[data.type].replace('location', `ud["${i}"].location`);

            funcFragments.push(`
            cu = ud["${i}"];
            cv = cu.value;
            v = uv["${i}"];
            ${template};`);
        }
    }

    // console.log(funcFragments.join("\n"));

    return new Function("ud", "uv", "renderer", "syncData", funcFragments.join("\n"));
}