

const attributeFormatData = {
    float32:    { size: 1, stride: 4, normalize: false },
    float32x2:  { size: 2, stride: 8, normalize: false },
    float32x3:  { size: 3, stride: 12, normalize: false },
    float32x4:  { size: 4, stride: 16, normalize: false },

    sint32:     { size: 1, stride: 4, normalize: false },
    sint32x2:   { size: 2, stride: 8, normalize: false },
    sint32x3:   { size: 3, stride: 12, normalize: false },
    sint32x4:   { size: 4, stride: 16, normalize: false },

    uint32:     { size: 1, stride: 4, normalize: false },
    uint32x2:   { size: 2, stride: 8, normalize: false },
    uint32x3:   { size: 3, stride: 12, normalize: false },
    uint32x4:   { size: 4, stride: 16, normalize: false },

    // TODO 补充其他类型
}

export function getAttributeInfoFromFormat(format) {
    return attributeFormatData[format] ?? attributeFormatData['float32'];
}