
// 模板模式
export const STENCIL_MODES = {
    DISABLED: 0,
    RENDERING_MASK_ADD: 1,
    MASK_ACTIVE: 2,
    RENDERING_MASK_REMOVE: 3,
    NONE: 4,
}


export const GpuStencilModes = [];

GpuStencilModes[STENCIL_MODES.DISABLED] = {
    stencilWriteMask: 0,
    stencilReadMask: 0,
};


GpuStencilModes[STENCIL_MODES.RENDERING_MASK_ADD] = {
    stencilFront: {
        compare: 'equal',
        passOp: 'increment-clamp'
    },
    stencilBack: {
        compare: 'equal',
        passOp: 'increment-clamp'
    }
}

GpuStencilModes[STENCIL_MODES.MASK_ACTIVE] = {
    stencilWriteMask: 0,
    stencilFront: {
        compare: 'equal',
        passOp: 'keep'
    },
    stencilBack: {
        compare: 'equal',
        passOp: 'keep'
    }
}

GpuStencilModes[STENCIL_MODES.RENDERING_MASK_REMOVE] = {
    stencilFront: {
        compare: 'equal',
        passOp: 'decrement-clamp'
    },
    stencilBack: {
        compare: 'equal',
        passOp: 'decrement-clamp'
    }
}

GpuStencilModes[STENCIL_MODES.NONE] = undefined;