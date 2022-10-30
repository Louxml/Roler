
import { Scene } from "./Scene.js";

/**
 * 场景管理器
 * 
 */
export class SceneManager{
    /**
     * 单例对象
     * @static
     */
    static _instance;

    /**
     * 场景列表
     * @public
     */
    scenes = [];

    /**
     * 当前活动场景
     * @private
     */
    _main = null;

    /**
     * 即将激活场景
     * @protected
     */
    _preScene = null;


    static getInstance(){
        return SceneManager._instance
    }

    get main(){
        return this._main; 
    }

    constructor(game){
        if (new.target !== SceneManager) return;
        if (SceneManager._instance) return SceneManager._instance;
        SceneManager._instance = this;

        game.runner.add(this.onUpdate, this)

        return this;
    }

    /**
     * 添加场景到场景列表
     * @param {Scene} scene 场景
     * @public
     * @return this 返回改对象（用于链式调用）
     */
    addScene(scene){
        if (!(scene instanceof Scene)){
            throw "Error scene";
        }
        if (this.scenes.includes(scene)){
            throw "This scene does exist in the SceneManger."
        }

        this.scenes.push(scene);
        
        return this;
    }

    /**
     * 从场景列表里移除场景
     * @param {Scene} scene 场景
     * @public
     * @return this 返回改对象（用于链式调用）
     */
    removeScene(scene){
        if (!(scene instanceof Scene)){
            throw "Error scene";
        }
        if (!this.scenes.includes(scene)){
            throw "This scene does no exist in the SceneManger."
        }

        // 移除当前场景（预备移除处理）
        if(scene === this._main)this._main = null;

        // 移除将跳转场景
        if(scene === this._preScene)this._preScene = null;

        // 移除
        this.scenes = this.scenes.filter((v, i) => {
            if (v === scene)return false;
            return true;
        });

        return this;
    }

    /**
     * 通过名字获取场景
     * @param {String} name 场景名字
     * @returns 场景
     */
    getSceneByName(name){
        if(typeof name != "string") throw "Name Error";

        const scene = this.scenes.find((v) => {
            return v.name === name
        })

        return scene;
    }

    /**
     * 获取当前场景
     * @returns 主场景
     */
    getMainScene(){
        return this.main;
    }

    /**
     * 获取场景列表
     * @returns 场景列表
     */
    getSceneList(){
        return this.scenes
    }

    /**
     * 开始场景
     * @param {Scene} scene 场景
     * @public
     * @return this 返回改对象（用于链式调用）
     */
    startScene(scene){
        // 场景名字
        if(typeof scene === "string")scene = this.getSceneByName(scene);

        if (!(scene instanceof Scene)){
            throw "Error scene";
        }

        if (!this.scenes.includes(scene)){
            throw "This scene does no exist in the SceneManger."
        }

        this._preScene = scene;
        if(this._main){
            this._main.destroy();
        }else{
            this._main = this._preScene;
            this._preScene = null;
        }

        return this;
    }

    /**
     * 更新
     * @private
     */
    onUpdate(dt){
        // 销毁主场景重置
        if(this._main && this._main._state === 3){
            this._main._state = 0;
            this._main = null;
        }

        // 更新主场景
        if(this._preScene){
            this._main = this._preScene;
            this._preScene = null;
        }
        
        if (this._main){
            this._main._onEnter();
            this._main._onUpdate(dt);
            this._main._onExit();
        }
    }
}