// common (19个)
const commonExtensions = [
    "EXT_clip_control",
    "EXT_color_buffer_half_float",
    "EXT_depth_clamp",
    "EXT_float_blend",
    "EXT_polygon_offset_clamp",
    "EXT_texture_compression_bptc",
    "EXT_texture_compression_rgtc",
    "EXT_texture_filter_anisotropic",
    "EXT_texture_mirror_clamp_to_edge",
    "KHR_parallel_shader_compile",
    "OES_texture_float_linear",
    "WEBGL_blend_func_extended",
    "WEBGL_compressed_texture_s3tc",
    "WEBGL_compressed_texture_s3tc_srgb",
    "WEBGL_debug_renderer_info",
    "WEBGL_debug_shaders",
    "WEBGL_lose_context",
    "WEBGL_multi_draw",
    "WEBGL_polygon_mode",
]

// webgl1 （16个）
const webgl1 = [
    "ANGLE_instanced_arrays",
    "EXT_blend_minmax",
    "EXT_disjoint_timer_query",
    "EXT_frag_depth",
    "EXT_shader_texture_lod",
    "EXT_sRGB",
    "OES_element_index_uint",
    "OES_fbo_render_mipmap",
    "OES_standard_derivatives",
    "OES_texture_float",
    "OES_texture_half_float",
    "OES_texture_half_float_linear",
    "OES_vertex_array_object",
    "WEBGL_color_buffer_float",
    "WEBGL_depth_texture",
    "WEBGL_draw_buffers",
]

// webgl2 （13个）
const webgl2 = [
    "EXT_color_buffer_float",
    "EXT_conservative_depth",
    "EXT_disjoint_timer_query_webgl2",
    "EXT_render_snorm",
    "EXT_texture_norm16",
    "NV_shader_noperspective_interpolation",
    "OES_draw_buffers_indexed",
    "OES_sample_variables",
    "OES_shader_multisample_interpolation",
    "OVR_multiview2",
    "WEBGL_clip_cull_distance",
    "WEBGL_provoking_vertex",
    "WEBGL_stencil_texturing",
]

const common = {
    // anisotropicFiltering: "EXT_texture_filter_anisotropic",
    // floatTextureLinear: "OES_texture_float_linear",
    // s3tc: "WEBGL_compressed_texture_s3tc",
    // s3tcSRGB: "WEBGL_compressed_texture_s3tc_srgb",
    // etc: "WEBGL_compressed_texture_etc",
    // etc1: "WEBGL_compressed_texture_etc1",
    // pvrtc: ["WEBGL_compressed_texture_pvrtc", "WEBKIT_WEBGL_compressed_texture_pvrtc"],
    // atc: "WEBGL_compressed_texture_atc",
    // astc: "WEBGL_compressed_texture_astc",
    // bptc: "WEBGL_compressed_texture_bptc",
    // rgtc: "WEBGL_compressed_texture_rgtc",
    loseContext: "WEBGL_lose_context",
}

export const webgl1Extensions = {
    ...common,
    // drawBuffers: "WEBGL_draw_buffers",
    // depthTexture: "WEBGL_depth_texture",
    vertexArrayObject: ["OES_vertex_array_object", "MOZ_OES_vertex_array_object", "WEBKIT_OES_vertex_array_object"],
    uint32ElementIndex: "OES_element_index_uint",

    // floatTexture: "OES_texture_float",
    // halfFloatTexture: "OES_texture_half_float",
    // halfFloatLinearTexture: "OES_texture_half_float_linear",
    // vertexAttribDivisorANGLE: "ANGLE_instanced_arrays",
    sRGB: "EXT_sRGB",
}

export const webgl2Extensions = {
    ...common,
    // colorBufferFloat: "EXT_color_buffer_float",
}