class UnionFind{
    constructor(){
        this.data = [];
    }
    find(v){
        return this.data[v];
    }
    union(v1,v2){
        if(this.data[v1] === undefined)this.data[v1] = v1;
        if(this.data[v2] === undefined)this.data[v2] = v1;
        else if(v1 != v2){
            let t = this.data[v2];
            for(let i = 0;i < this.data.length;i++){
                if(this.data[i] === t)this.data[i] = this.data[v1];
            }
        }
    }
    isSame(v1,v2){
        return this.data[v1] == this.data[v2];
    }
}

class UnionSet{
    constructor(){
        this.data = [];
        this.size = [];
        this.rank = [];
    }

    find(v){
        // 不优化
        // return (v == this.data[v] || this.data[v] === undefined)?this.data[v]:this.find(this.data[v]);
        // 路径压缩
        // return this.data[v] = (v == this.data[v] || this.data[v] === undefined)?this.data[v]:this.find(this.data[v]);
        // 路径压缩减半
        // return this.data[v] = (v == this.data[v] || this.data[v] === undefined)?this.data[v]:this.find(this.data[this.data[v]]);
        // 路径分裂
        // while(this.data[v] && v != this.data[v])[this.data[v],v] = [this.data[this.data[v]],this.data[v]];
        // return this.data[v];
        // 路径减半
        while(this.data[v] && v != this.data[v])v = this.data[v] = this.data[this.data[v]];
        return this.data[v];
    }

    union(v1,v2){
        let p1 = this.find(v1);
        let p2 = this.find(v2);
        if(p1 === undefined)p1 = this.data[v1] = v1;
        if(p2 === undefined)p2 = this.data[v2] = v2;
        if(p1 == p2)return;
        this.data[p1] = p2;
    }

    unionSize(v1,v2){
        let p1 = this.find(v1);
        let p2 = this.find(v2);
        if(p1 === undefined){
            p1 = this.data[v1] = v1;
            this.size[p1] = 1;
        }
        if(p2 === undefined){
            p2 = this.data[v2] = v2;
            this.size[p2] = 1;
        }
        if(p1 == p2)return;
        if(this.size[p1] <= this.size[p2]){
            this.size[p2] += this.size[p1];
            this.data[p1] = p2;
        }else{
            this.size[p1] += this.size[p2];
            this.data[p2] = p1;
        }
    }

    unionRank(v1,v2){
        let p1 = this.find(v1);
        let p2 = this.find(v2);
        if(p1 === undefined){
            p1 = this.data[v1] = v1;
            this.rank[p1] = 1;
        }
        if(p2 === undefined){
            p2 = this.data[v2] = v2;
            this.rank[p2] = 1;
        }
        if(p1 == p2)return;
        if(this.rank[p1] <= this.rank[p2]){
            if(this.rank[p1] == this.rank[p2])this.rank[p2]++;
            this.data[p1] = p2;
        }else{
            this.data[p2] = p1;
        }
    }

    isSame(v1,v2){
        return this.find(v1) == this.find(v2);
    }
}

export { UnionFind, UnionSet };