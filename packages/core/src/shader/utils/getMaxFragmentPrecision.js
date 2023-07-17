
import { Adapter } from "../../../../browser/src/index.js";
import { PRECISION } from "../../../../constants/src/index.js";

let maxFragmentPrecision;

export function getMaxFragmentPrecision(gl){
    if (!maxFragmentPrecision){
        const canvas = Adapter.createCanvas()
        let gl = canvas.getContext('webgl2', {});

        // webgl1
        if (!gl){
            gl = canvas.getContext('webgl', {}) || canvas.getContext('experimental-webgl', {})
        }

        const shaderFragment = gl?.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
        maxFragmentPrecision = shaderFragment ? PRECISION.HIGH : PRECISION.MEDIUM;
    }

    return maxFragmentPrecision;
}