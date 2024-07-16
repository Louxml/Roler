


/**
 * 绑定组是可以绑定到着色器的资源的集合
 */
export class BindGroup {
    
    resources = Object.create(null);

    #key = '';

    #update;

    constructor(resources) {

        this.#update = false
        
        let index = 0;
        for (const i in resources) {
            const resource = resources[i];

            this.setResource(resource, index++);
        }

        this.#updateKey();
    }

    /**
     * 绑定资源到索引
     * @param {BindResource} resource 
     * @param {Number} index 索引
     * @returns 
     */
    setResource(resource, index) {

        const currentResource = this.resources[index];
        
        if (resource === currentResource) return;

        // 移除旧资源的事件监听
        currentResource?.off?.('change', this.onResourceChange, this);

        // 注册新资源的事件监听
        resource.on?.('change', this.onResourceChange, this);

        this.resources[index] = resource;
        this.#update = true;
    }

    /**
     * 获取指定索引的资源
     * @param {Number} index 索引
     * @returns BindResource
     */
    getResource(index) {
        return this.resources[index];
    }

    onResourceChange(resource) {
        this.#update = true;

        if (resource.destroyed) {
            for (const i in this.resources){
                if (this.resources[i] === resource) {
                    this.resources[i] = null;
                }
            }
        }else {
            this.#updateKey();
        }
    }

    #updateKey() {
        if (!this.#update) return;
        this.#update = false;

        const keys = [];
        for (const i in this.resources) {
            keys.push(this.resources[i]?.resourceId);
        }

        this.#key = keys.join('|');
    }

    /**
     * 销毁
     */
    destroy(){
        for (const i in this.resources) {
            const resource = this.resources[i];
            resource.off?.('change', this.onResourceChange, this);
        }

        this.resources = null;
    }

    get key() {
        return this.#key;
    }
}