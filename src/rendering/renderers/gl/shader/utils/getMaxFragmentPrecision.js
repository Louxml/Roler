import { DOMAdapter } from "../../../../../environment/Adapter.js";

let maxFragmentPrecision;

export function getMaxFragmentPrecision() {
    if (maxFragmentPrecision) return maxFragmentPrecision;

    maxFragmentPrecision = 'mediump';

    const canvas = DOMAdapter.get().createCanvas();
    const gl = canvas.getContext('webgl');

    const shaderFragment = gl?.getShaderPrecisionFormat?.(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
    // const shaderVertex = gl?.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT);

    maxFragmentPrecision = shaderFragment.precision ? 'highp' : 'mediump';

    return maxFragmentPrecision;

}