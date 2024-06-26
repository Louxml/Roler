

import { ExtensionType } from "../../../../extensions/index.js";
import { State } from "../../shared/state/State.js";
import { System } from "../../shared/system/System.js";
import { mapWebGLBlendModes } from "./mapWebGLBlendModes.js";


const BLEND = 0;
const OFFSET = 1;
const CULLING = 2;
const DEPTH_TEST = 3;
const DEPTH_MASK = 4;
const WINDING = 5;


export class GLStateSystem extends System {

    /** @ignore */
    static extension = {
        type: [
            ExtensionType.WebGLSystem
        ],
        name: 'state'
    };

    /**
     * 状态值
     * @Number
     */
    stateId;

    /**
     * webgl上下文
     * @type {WebGLRenderingContext}
     * @protected
     */
    #gl;

    /**
     * 多边形深度偏移
     * @type {Number}
     */
    polygonOffset;

    /**
     * 混合模式
     */
    blendMode;

    /**
     * 混合模式列表
     */
    blendModeMap;

    /**
     * 方法列表
     */
    map;

    checks;

    #defaultState;

    _blendEq;
    
    constructor(renderer){
        super(renderer);
        
        this.#gl = null;

        this.stateId = 0;
        this.polygonOffset = 0;
        this.blendMode = 'none';

        this._blendEq = false;

        this.map = [];
        this.map[BLEND] = this.setBlend;
        this.map[OFFSET] = this.setOffset;
        this.map[CULLING] = this.setCullFace;
        this.map[DEPTH_TEST] = this.setDepthTest;
        this.map[DEPTH_MASK] = this.setDepthMask;
        this.map[WINDING] = this.setFrontFace;

        this.checks = [];

        this.#defaultState = State.for2d();
    }

    init(){
        console.log("GLStateSytem init")
    }

    contextChange(gl){
        this.#gl = gl;

        this.blendModeMap = mapWebGLBlendModes(gl);
        
        this.reset();
    }

    /**
     * 设置当前状态
     * @param {State} state state对象
     */
    set(state){
        state = state || this.#defaultState;

        if (this.stateId !== state.data){

            let diff = state.data ^ this.stateId;
            let i = 0;
            
            while (diff){
                if (diff & 1){
                    this.map[i].call(this, !!(state.data & (1 << i)));
                }

                diff >>= 1;
                i++;
            }

            this.stateId = state.data;
        }

        for (let i = 0; i < this.checks.length; i++){
            this.checks[i](this, state);
        }
    }

    /**
     * 强制设置当前状态
     * @param {State} state state对象
     */
    forceState(state){
        state = state || this.#defaultState;

        for (let i = 0; i < this.map.length; i++){
            this.map[i].call(this, !!(state.data & (1 << i)));
        }

        for (let i = 0; i < this.checks.length; i++){
            this.checks[i](this, state);
        }
        this.stateId = state.data;
    }

    /**
     * 是否开启混合模式
     * @param {Boolean} value 是否开启
     */
    setBlend(value){
        this._updateCheck(GLStateSystem._checkBlendMode, value);

        this.#gl[value ? 'enable' : 'disable'](this.#gl.BLEND);
    }

    /**
     * 是否开启多边形深度偏移
     * @param {Boolean} value 是否开启
     */
    setOffset(value){
        this._updateCheck(GLStateSystem._checkPolygonOffset, value);
        this.#gl[value ? 'enable' : 'disable'](this.#gl.POLYGON_OFFSET_FILL);
    }

    /**
     * 是否开启剔除面(背面)
     * @param {Boolean} value 是否开启
     */
    setCullFace(value){
        this.#gl[value ? 'enable' : 'disable'](this.#gl.CULL_FACE);
    }

    /**
     * 是否开启深度测试
     * @param {Boolean} value 是否开启
     */
    setDepthTest(value){
        this.#gl[value ? 'enable' : 'disable'](this.#gl.DEPTH_TEST);
    }

    /**
     * 是否开启深度掩码
     * @param {Boolean} value 是否开启
     */
    setDepthMask(value){
        this.#gl.depthMask(value);
    }

    /**
     * 设置多边形正面
     * @param {Boolean} value true: 顺时针, false: 逆时针
     */
    setFrontFace(value){
        this.#gl.frontFace(value ? this.#gl.CW : this.#gl.CCW);
    }

    /**
     * 设置混合模式
     * @param {String} value 混合模式
     * @returns 
     */
    setBlendMode(value){
        value = this.blendModeMap[value] ? value : 'normal';

        if (value === this.blendMode)return;

        this.blendMode = value;

        const mode = this.blendModeMap[value];
        const gl = this.#gl;

        if (mode.length === 2){
            gl.blendFunc(mode[0], mode[1]);
        }else if (mode.length >= 4){
            gl.blendFuncSeparate(mode[0], mode[1], mode[2], mode[3]);
        }

        if (mode.length === 6){
            this._blendEq = true;
            gl.blendEquationSeparate(mode[4], mode[5]);
        }else if (this._blendEq){
            this._blendEq = false;
            gl.blendEquationSeparate(gl.FUNC_ADD, gl.FUNC_ADD)
        }
    }

    /**
     * 设置多边形偏移
     * @param {Number} value 多边形偏移量
     * @param {Number} scale 多边形偏移缩放
     */
    setPolygonOffset(value, scale){
        this.#gl.polygonOffset(value, scale);
    }

    
    reset(){
        this.#gl.pixelStorei(this.#gl.UNPACK_FLIP_Y_WEBGL, false);

        this.forceState();

        this._blendEq = true;

        this.blendMode = 'none';
        this.setBlendMode('normal');
    }


    /**
     * 添加或移除检查方法
     * @param {Function} func 要添加或删除的函数
     * @param {Boolean} value 添加或移除
     */
    _updateCheck(func, value){
        const index = this.checks.indexOf(func);

        if(value && index === -1){
            this.checks.push(func);
        }else if(!value && index !== -1){
            this.checks.splice(index, 1);
        }        
    }

    static _checkBlendMode(system, state){
        system.setBlendMode(state.blendMode);
    }

    static _checkPolygonOffset(system, state){
        system.setPolygonOffset(1, state.polygonOffset);
    }


    destroy(){
        this.#gl = null;
        this.checks.length = 0;
    }

    get gl(){
        return this.#gl;
    }

}