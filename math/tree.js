class TreeNode{
    constructor(value=null,left=null,right=null){
        this.value = value;
        this.left = left;
        this.right = right;
    }
    preorder(){
        let res = [];
        const dfs = (node) => {
            res.push(node.value);
            node.left && dfs(node.left);
            node.right && dfs(node.right);
        }
        dfs(this);
        return res;
    }
    inorder(){
        let res = [];
        const dfs = (node) => {
            node.left && dfs(node.left);
            res.push(node.value);
            node.right && dfs(node.right);
        }
        dfs(this);
        return res;
    }
    postorder(){
        let res = [];
        const dfs = (node) => {
            node.left && dfs(node.left);
            node.right && dfs(node.right);
            res.push(node.value);
        }
        dfs(this);
        return res;
    }
}

class BiTree{
    constructor(arr=[]){
        this.root = null;
        arr.forEach(v=>this.add(v));
    }
    add(value){
        if(!this.root){
            this.root = new TreeNode(value);
            return;
        }else{
            let head = this.root
            while(head){
                if(value < head.value && head.left)head = head.left;
                else if(value > head.value && head.right)head = head.right;
                else break;
            }
            if(value < head.value)head.left = new TreeNode(value);
            else if(value > head.value)head.right = new TreeNode(value);
        }
    }
    delete(value){
        let pre = this.root,head = this.root;
        let next;
        while(head && head.value!=value){
            pre = head;
            if(value < head.value)head = head.left;
            else if(value > head.value)head = head.right;
        }
        if(head){
            if(!head.right)next = head.left;
            else if(!head.left)next = head.right;
            else{
                next = head.right;
                let left = head.left;
                let p = head;
                while(p.left)p = p.left;
                p.left = left;
            }
            if(pre == head)this.root = next;
            else if(head.value < pre.value)pre.left = next;
            else if(head.value > pre.value)pre.right = next;
            return true;
        }
        return false;
    }
    find(value){
        let head = this.root;
        while(head){
            if(value == head.value)return true;
            else if(value < head.value)head = head.left;
            else if(value > head.value)head = head.right;
        }
        return false;
    }
    preorder(){
        return this.root && this.root.preorder();
    }
    inorder(){
        return this.root && this.root.inorder();
    }
    postorder(){
        return this.root && this.root.postorder();
    }
}

export default { TreeNode, BiTree };