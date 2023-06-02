
import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";

import { State } from "./State.js";
import { BLEND_MODES } from "../../../constants/src/index.js";

const BLEND = 0;
const OFFSET = 1;
const CULLING = 2;
const DEPTH_TEST = 3;
const WINDING = 4;
const DEPTH_MASK = 5;

export class StateSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "state",
        priority: 70
    }

    /**
     * 渲染器对象
     * @public
     */
    renderer;

    /**
     * 上下文环境
     * @private
     */
    gl;

    /**
     * 状态值
     * @public
     */
    stateId;

    /**
     * 多边形深度偏移
     * @public
     */
    polygonOffset;

    /**
     * 混合模式
     * @private
     */
    blendMode;

    /**
     * 混合模式列表
     */
    blendModes;

    /**
     * 默认状态
     * @private
     */
    defaultState;


    /**
     * 状态设置方法列表
     * @private
     */
    map;


    constructor(renderer){
        super();

        this.renderer = renderer;

        this.stateId = 0;

        this.polygonOffset = 0;

        this.blendMode = BLEND_MODES.NONE;

        this.map = [];
        this.map[BLEND] = this.setBlend;
        this.map[OFFSET] = this.setOffset;
        this.map[CULLING] = this.setCullFace;
        this.map[DEPTH_TEST] = this.setDepthTest;
        this.map[WINDING] = this.setFrontFace;
        this.map[DEPTH_MASK] = this.setDepthMask;

        this.defaultState = new State();
        this.defaultState.blend = true;
    }

    init(){
        console.log("State System")
    }

    contextChange(){
        this.gl = this.renderer.gl;

        this.mapWebGLBlendModes(this.gl);

        this.reset();
    }

    /**
     * 设置状态
     * @param {State} state 状态对象
     */
    set(state){
        state = state || this.defaultState;

        if (this.stateId !== state.data){
            let diff = this.stateId ^ state.data;
            let i = 0;

            while(diff){
                
                if (diff & 1){
                    this.map[i].call(this, !!(state.data & (1 << i)));
                }
                diff >>= 1;
                i++;
            }

            // TODO 怎么优化设置State里面的混合模式的值和偏移量的值
            this.setBlendMode(state.blendMode)

            this.setPolygonOffset(state.polygonOffset);

            this.stateId = state.data;
        }
    }

    /**
     * 强制设置所有状态
     * @param {State} state 状态对象
     */
    forceState(state){
        state = state || this.defaultState;
        for (let i in this.map){
            this.map[i].call(this, !!(state.data & (1 << i)));
        }

        // TODO 怎么优化设置State里面的混合模式的值和偏移量的值
        this.setBlendMode(state.blendMode)

        this.setPolygonOffset(state.polygonOffset);
    }

    /**
     * 设置是否开启混合模式
     * @param {Boolean} value 是否开启混合模式
     */
    setBlend(value){
        const { gl } = this;

        gl[value ? 'enable' : 'disable'](gl.BLEND);
        
        if (value){
            this.setBlendMode(this.blendMode);
        }
        
    }

    // TODO可参考
    // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/blendColor
    // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/blendEquation
    // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/blendEquationSeparate
    // https://developer.mozilla.org/zh-CN/docs/Web/API/WebGLRenderingContext/blendFunc
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFuncSeparate
    setBlendMode(value){
        if (this.blendMode === value){
            return;
        }

        this.blendMode = value;

        const mode = this.blendModes[value];
        const gl = this.gl;

        if (mode.length === 2){
            gl.blendFunc(mode[0], mode[1]);
        }else{
            gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
        }

        if (mode.length === 6){
            gl.blendEquationSeparate(mode[4], mode[5]);
        }else{
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD);
        }
    }

    /**
     * 设置是否开启多边形偏移
     * @param {Boolean} value 是否开启多边形偏移
     */
    setOffset(value){
        const gl = this.gl;

        gl[value ? 'enable' : 'disable'](gl.POLYGON_OFFSET_FILL);

        if (value){
            this.setPolygonOffset(this.polygonOffset);
        }
    }

    // TODO 学习polygonOffset方法细节
    setPolygonOffset(value){
        const gl = this.gl;

        this.polygonOffset = value;
        gl.polygonOffset(1, value);
    }

    /**
     * 设置是否剔除面（背面）
     * @param {Boolean} value 是否剔除面
     */
    setCullFace(value){
        const gl = this.gl;
        gl[value ? 'enable' : 'disable'](gl.CULL_FACE);
    }
    
    /**
     * 设置是否开启深度测试
     * @param {Boolean} value 是否开启深度测试
     */
    setDepthTest(value){
        const gl = this.gl;
        gl[value ? 'enable' : 'disable'](gl.DEPTH_TEST);
    }

    /**
     * 设置正面（True 为顺时针， False为逆时针）
     * @param {Boolean} value 是否顺时针为正面
     */
    setFrontFace(value){
        const gl = this.gl;
        gl.frontFace(gl[value ? 'CW' : 'CCW']);
    }

    /**
     * 设置是否开启深度模板
     * @param {Boolean} value 是否开启深度模板
     */
    setDepthMask(value){
        const gl = this.gl;
        gl.depthMask(value);
    }

    reset(){
        const gl = this.gl;
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        this.forceState(this.defaultState);

        this.setBlendMode(BLEND_MODES.NORMAL);
    }

    /**
     * 初始化当前上下文环境的混合模式列表
     * @param {WebGLRenderContext} gl 上下文环境
     */
    mapWebGLBlendModes(gl){
        // TODO 有些还没有写
        // 参考 https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
        const array = [];
        array[BLEND_MODES.NONE]             = [0, 0];
        array[BLEND_MODES.NORMAL]           = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.ADD]              = [gl.ONE, gl.ONE];
        array[BLEND_MODES.MULTIPLY]         = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.SCREEN]           = [gl.ONE, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        
        // TODO 待处理
        array[BLEND_MODES.OVERLAY]          = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.DARKEN]           = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.LIGHTEN]          = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.COLOR_DODGE]      = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.COLOR_BURN]       = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.HARD_LIGHT]       = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.SOFT_LIGHT]       = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.DIFFERENCE]       = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.EXCLUSION]        = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.HUE]              = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.SATURATION]       = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.COLOR]            = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.LUMINOSITY]       = [gl.ONE, gl.ONE_MINUS_SRC_ALPHA];

        // 非预乘混合模式
        array[BLEND_MODES.NORMAL_NPM]       = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.ADD_NPM]          = [gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE];
        array[BLEND_MODES.SCREEN_NPM]       = [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_COLOR, gl.ONE, gl.ONE_MINUS_SRC_ALPHA];

        // 复合操作
        array[BLEND_MODES.SRC_IN]           = [gl.DST_ALPHA, gl.ZERO];
        array[BLEND_MODES.SRC_OUT]          = [gl.ONE_MINUS_DST_ALPHA, gl.ZERO];
        array[BLEND_MODES.SRC_ATOP]         = [gl.DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.DST_OVER]         = [gl.ONE_MINUS_DST_ALPHA, gl.ONE];
        array[BLEND_MODES.DST_IN]           = [gl.ZERO, gl.SRC_ALPHA];
        array[BLEND_MODES.DST_OUT]          = [gl.ZERO, gl.ONE_MINUS_SRC_ALPHA];
        array[BLEND_MODES.DST_ATOP]         = [gl.ONE_MINUS_DST_ALPHA, gl.SRC_ALPHA];
        array[BLEND_MODES.XOR]              = [gl.ONE_MINUS_DST_ALPHA, gl.ONE_MINUS_SRC_ALPHA];
        
        // SUBTRACT from flash
        array[BLEND_MODES.SUBTRACT]         = [gl.ONE, gl.ONE, gl.ONE, gl.ONE, gl.FUNC_REVERSE_SUBTRACT, gl.FUNC_ADD];

        this.blendModes = array;
    }

    destroy(){

    }

}

Extension.add(StateSystem);