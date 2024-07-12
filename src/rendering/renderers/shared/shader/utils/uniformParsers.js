

/**
 * 常用对象的设置方式
 */
export const uniformParsers = [
    // 更新Matrix对象到Mat3
    {
        type: 'mat3x3<f32>',
        /**
         * 判断类型
         * @param {UniformData} data 
         * @returns 
         */
        test: (data) => {
            // TODO
            return data.value.length === 9;
        },
        // 这里data是4*4的矩阵，m是3*3的？
        ubo: `
            var m = uv[name].toArray(true);
            data[offset] = m[0];
            data[offset + 1] = m[1];
            data[offset + 2] = m[2];
            data[offset + 4] = m[3];
            data[offset + 5] = m[4];
            data[offset + 6] = m[5];
            data[offset + 8] = m[6];
            data[offset + 9] = m[7];
            data[offset + 10] = m[8];
        `,
        uniform: `
            gl.uniformMatrix3fv(uv[name].location, false, uv[name].toArray(true));
        `
    },
    // 更新Rectangle对象到Vec4
    {
        type: 'vec4<f32>',
        /**
         * 判断类型
         * @param {UniformData} data Uniform数据格式
         * @returns 
         */
        test: (data) => {
            return data.type === 'vec4<f32>' && data.size === 1 && data.value.width !== undefined;
        },
        ubo: `
            var v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
            data[offset + 2] = v.width;
            data[offset + 3] = v.height;
        `,
        uniform: `
            var cv = ud[name].value;
            var v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height) {
                cv[0] = v.x;
                cv[1] = v.y;
                cv[2] = v.width;
                cv[3] = v.height;
                gl.uniform4f(ud[name].location, v.x, v.y, v.width, v.height);
            }
        `
    },
    
    // 更新Color对象到Vec4
    {
        type: 'vec4<f32>',
        /**
         * 判断类型
         * @param {UniformData} data 
         * @returns 
         */
        test: (data) => {
            return data.type === 'vec4<f32>' && data.size === 1 && data.value.r !== undefined;
        },
        ubo: `
            var v = uv[name];
            data[offset] = v.r;
            data[offset + 1] = v.g;
            data[offset + 2] = v.b;
            data[offset + 3] = v.a;
        `,
        uniform: `
            var cv = ud[name].value;
            var v = uv[name];
            if (cv[0] !== v.r || cv[1] !== v.g || cv[2] !== v.b || cv[3] !== v.a) {
                cv[0] = v.r;
                cv[1] = v.g;
                cv[2] = v.b;
                cv[3] = v.a;
                gl.uniform4f(ud[name].location, v.r, v.g, v.b, v.a);
            }
        `
    },
    
    // 更新Color对象到Vec3
    {
        type: 'vec3<f32>',
        test: (data) => {
            return data.type === 'vec3<f32>' && data.size === 1 && data.value.r !== undefined;
        },
        ubo: `
            var v = uv[name];
            data[offset] = v.r;
            data[offset + 1] = v.g;
            data[offset + 2] = v.b;  
        `,
        uniform: `
            var cv = ud[name].value;
            var v = uv[name];
            if (cv[0] !== v.r || cv[1] !== v.g || cv[2] !== v.b) {
                cv[0] = v.r;
                cv[1] = v.g;
                cv[2] = v.b;
                gl.uniform3f(ud[name].location, v.r, v.g, v.b);
            }
        `
    },
    
    // 更新 点数据 到Vec2
    {
        type: 'vec2<f32>',
        test: (data) => {
            return data.type === 'vec2<f32>' && data.size === 1 && data.value.x !== undefined;
        },
        ubo: `
            var v = uv[name];
            data[offset] = v.x;
            data[offset + 1] = v.y;
        `,
        uniform: `
            var cv = ud[name].value;
            var v = uv[name];
            if (cv[0] !== v.x || cv[1] !== v.y) {
                cv[0] = v.x;
                cv[1] = v.y;
                gl.uniform2f(ud[name].location, v.x, v.y);
            }
        `
    }
];


/**
 * 通用简单数据Uniform解析器
 */
export const commonSingleUniformParsers = {
    'f32': `
        if (ud[name].value !== uv[name]) {
            ud[name].value = uv[name];
            gl.uniform1f(ud[name].location, uv[name]);
        }
    `,
    'vec2<f32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2f(ud[name].location, v[0], v[1]);
        }
    `,
    'vec3<f32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3f(ud[name].location, v[0], v[1], v[2]);
        }
    `,
    'vec4<f32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4f(ud[name].location, v[0], v[1], v[2], v[3]);
        }
    `,

    'i32': `
        if (ud[name].value !== uv[name]) {
            ud[name].value = uv[name];
            gl.uniform1i(ud[name].location, uv[name]);
        }
    `,
    'vec2<i32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2i(ud[name].location, v[0], v[1]);
        }
    `,
    'vec3<i32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3i(ud[name].location, v[0], v[1], v[2]);
        }
    `,
    'vec4<i32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4i(ud[name].location, v[0], v[1], v[2], v[3]);
        }
    `,

    'u32': `
        if (ud[name].value !== uv[name]) {
            ud[name].value = uv[name];
            gl.uniform1ui(ud[name].location, uv[name]);
        }
    `,
    'vec2<u32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2ui(ud[name].location, v[0], v[1]);
        }
    `,
    'vec3<u32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3ui(ud[name].location, v[0], v[1], v[2]);
        }
    `,
    'vec4<u32>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4ui(ud[name].location, v[0], v[1], v[2], v[3]);
        }
    `,

    'bool': `
        if (ud[name].value !== uv[name]) {
            ud[name].value = uv[name];
            gl.uniform1i(ud[name].location, uv[name] ? 1 : 0);
        }  
    `,
    'vec2<bool>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1]) {
            cv[0] = v[0];
            cv[1] = v[1];
            gl.uniform2i(ud[name].location, v[0] ? 1 : 0, v[1] ? 1 : 0);
        }
    `,
    'vec3<bool>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            gl.uniform3i(ud[name].location, v[0] ? 1 : 0, v[1] ? 1 : 0, v[2] ? 1 : 0);
        }
    `,
    'vec4<bool>': `
        var cv = ud[name].value;
        var v = uv[name];
        if (cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3]) {
            cv[0] = v[0];
            cv[1] = v[1];
            cv[2] = v[2];
            cv[3] = v[3];
            gl.uniform4i(ud[name].location, v[0] ? 1 : 0, v[1] ? 1 : 0, v[2] ? 1 : 0, v[3] ? 1 : 0);
        }
    `,
    'mat2x2<f32>': `
        gl.uniformMatrix2fv(ud[name].location, false, uv[name]);
    `,
    'mat3x3<f32>': `
        gl.uniformMatrix3fv(ud[name].location, false, uv[name]);
    `,
    'mat4x4<f32>': `
        gl.uniformMatrix4fv(ud[name].location, false, uv[name]);
    `
};

export const commonArrayUniformParsers = {
    'f32': `
        gl.uniform1fv(ud[name].location, uv[name]);
    `,
    'vec2<f32>': `
        gl.uniform2fv(ud[name].location, uv[name]);
    `,
    'vec3<f32>': `
        gl.uniform3fv(ud[name].location, uv[name]);
    `,
    'vec4<f32>': `
        gl.uniform4fv(ud[name].location, uv[name]);
    `,
    'i32': `
        gl.uniform1iv(ud[name].location, uv[name]);
    `,
    'vec2<i32>': `
        gl.uniform2iv(ud[name].location, uv[name]);
    `,
    'vec3<i32>': `
        gl.uniform3iv(ud[name].location, uv[name]);
    `,
    'vec4<i32>': `
        gl.uniform4iv(ud[name].location, uv[name]);
    `,
    'u32': `
        gl.uniform1uiv(ud[name].location, uv[name]);
    `,
    'vec2<u32>': `
        gl.uniform2uiv(ud[name].location, uv[name]);
    `,
    'vec3<u32>': `
        gl.uniform3uiv(ud[name].location, uv[name]);
    `,
    'vec4<u32>': `
        gl.uniform4uiv(ud[name].location, uv[name]);
    `,
    'bool': `
        gl.uniform1iv(ud[name].location, uv[name].map(v => v ? 1 : 0));
    `,
    'vec2<bool>': `
       gl.uniform2iv(ud[name].location, uv[name].map(v => v ? 1 : 0));
    `,
    'vec3<bool>': `
        gl.uniform3iv(ud[name].location, uv[name].map(v => v ? 1 : 0));
    `,
    'vec4<bool>': `
        gl.uniform4iv(ud[name].location, uv[name].map(v => v ? 1 : 0));
    `,
    'mat2x2<f32>': `
        gl.uniformMatrix2fv(ud[name].location, false, uv[name]);
    `,
    'mat3x3<f32>': `
        gl.uniformMatrix3fv(ud[name].location, false, uv[name]);
    `,
    'mat4x4<f32>': `
       gl.uniformMatrix4fv(ud[name].location, false, uv[name]);
    `,
}