
import { Runner } from "../../runner/src/index.js"
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
    _activeScene = null;

    /**
     * 即将激活index
     * @number
     * @protected
     */
    _index = -1;


    static getInstance(){
        return SceneManager._instance
    }

    get activeScene(){
        return this._activeScene; 
    }

    constructor(){
        if (new.target !== SceneManager) return;
        if (SceneManager._instance) return SceneManager._instance;
        SceneManager._instance = this;

        Runner.system.add(this._update, this)


        return this;
    }

    addScene(scene){
        if (!(scene instanceof Scene)){
            throw "Error scene";
        }
        if (this.scenes.includes(scene)){
            throw "This scene does exist in the SceneManger."
        }
        
        scene._uid = this.scenes.length;
        // 场景重命名
        if (!scene.name){
            scene.name = `Scene${scene._uid}`;
        }
        this.scenes.push(scene);
    }

    removeScene(scene){
        let index = 0;
        this.scenes = this.scenes.filter((v, i) => {
            if (v === scene)return false;
            v._uid = index++;
            return true;
        });
        
    }

    getSceneIndex(scene){
        if (scene instanceof Scene) return this.scenes.indexOf(scene);
        else if (typeof scene === "string") return this.scenes.findIndex((v) => v.name == scene);  
        else if (typeof scene === "number")  return scene;
        return -1;
    }

    findScene(scene){
        const index = this.getSceneIndex(scene);
        if (index >= 0){
            return this.scenes[index];
        }else return null;
        
    }

    startScene(scene){
        const index = this.getSceneIndex(scene)
        if (index < 0)throw "This scene does not exist in the SceneManger."
        this._index = index;
    }

    /**
     * 
     */
    _update(dt){
        this._activeScene = this.scenes[this._index];
        if (this._activeScene){
            this._activeScene._onEnter();
            this._activeScene._onUpdate(dt);
            this._activeScene._onExit();
            this._activeScene._onRemove();
        }
    }
}