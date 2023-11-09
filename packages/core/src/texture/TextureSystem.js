

import { System } from "../index.js";

import { Extension, ExtensionType } from "../../../extensions/src/index.js";
import { GLTexture } from "./GLTexture.js";


export class TextureSystem extends System{

    static extension = {
        type: ExtensionType.RendererSystem,
        name: "texture",
        priority: 60
    }

    /**
     * 渲染器对象
     * @public
     */
    renderer;

    gl;

    CONTEXT_UID;

    /**
     * 绑定的纹理列表
     * @Array
     * @public
     */
    boundTextures;

    /**
     * 当前管理的Texture字典
     * @Object
     * @public
     */
    managedTextures;

    /**
     * 空纹理字典
     * @private
     */
    #emptyTextures;

    /**
     * 当前激活纹理单元位置
     * @Number
     * @private
     */
    #currentLocation;

    constructor(renderer){
        super();

        this.renderer = renderer;

        this.boundTextures = [];

        this.#emptyTextures = {};
        this.#currentLocation = -1;

        this.managedTextures = {}
    }

    init(){
        console.log(`Texture System`);
    }

    contextChange(){
        this.disposeAll(true);

        const gl = this.gl = this.renderer.gl;
        this.CONTEXT_UID  = this.renderer.CONTEXT_UID;

        // 初始化绑定纹理列表
        const maxTextures = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        this.boundTextures.length= maxTextures;
        for (let i = 0; i < this.boundTextures.length; i++){
            this.boundTextures[i] = null;
        }

        // 空纹理
        this.#emptyTextures = {};

        this.#emptyTextures[gl.TEXTURE_2D] = new GLTexture(gl.createTexture());
        this.#emptyTextures[gl.TEXTURE_CUBE_MAP] = new GLTexture(gl.createTexture());

        // 纹理
        gl.bindTexture(gl.TEXTURE_2D, this.#emptyTextures[gl.TEXTURE_2D].texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array(4));
        
        // 立体纹理
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.#emptyTextures[gl.TEXTURE_CUBE_MAP].texture);
        for (let i = 0; i < 6; i++){
            gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        

        // for (let i = 0; i < this.boundTextures.length; i++){
        //     this.bind(null,  i);
        // }
    }

    bind(texture, location = 0){
        const { gl } = this;

        texture = texture?.getBaseTexture();

        if (texture?.valid){

            const glTexture = texture.glTextures[this.CONTEXT_UID] || this.initTexture(texture);


        }else{
            if (this.#currentLocation !== location){
                gl.activeTexture(gl.TEXTURE0 + location);
                this.#currentLocation = location;
            }
            gl.bindTexture(gl.TEXTURE_2D, this.#emptyTextures[gl.TEXTURE_2D].texture);
            this.boundTextures[location] = null;
        }
    }

    unbind(texture){
        const { gl, boundTextures } = this;

        // TODO 未知纹理什么意思
        


        for (let i = 0; i < boundTextures.length; i++){
            if (boundTextures[i] === texture){
                if (this.#currentLocation !== i){
                    gl.activeTexture(gl.TEXTURE0 + i);
                    this.#currentLocation = i;
                }

                gl.bindTexture(texture.target, this.#emptyTextures[texture.target].texture);
                boundTextures[i] = null;
            }
        }
    }

    reset(){
        
    }

    initTexture(texture){
        const { gl, CONTEXT_UID } = this;
        const glTexture =  new GLTexture(gl.createTexture());

        texture.glTextures[CONTEXT_UID] = glTexture;

        this.managedTextures[texture.id]=  texture;

        texture.disposeRunner.add(this);

        return glTexture
    }

    dispose(texture, contextLost){
        const { gl, CONTEXT_UID} = this;

        texture  = texture?.getBaseTexture();

        delete this.managedTextures[texture.id];

        texture.disposeRunner.remove(this);

        const glTexture = texture.glTextures[CONTEXT_UID];

        if (!glTexture) {
            return
        }

        this.unbind(texture);

        if (!contextLost){
            gl.deleteTexture(glTextures.texture);
        }

        delete texture.glTextures[CONTEXT_UID];
    }

    disposeAll(contextLost){
        for (const k in this.managedTextures){
            this.dispose(this.managedTextures[k], contextLost);
        }
    }

    destroy(){
        this.renderer = null;
    }

}

Extension.add(TextureSystem);