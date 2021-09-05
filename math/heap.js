class Heap{
    constructor(arr = []){
        this.data = arr;
    }
    getSize(){
        return this.data.length;
    }
    isEmpty(){
        return this.data.length === 0;
    }
    parent(i){
        return (i-1)/2|0;
    }
    leftChild(i){
        return 2*i+1;
    }
    rightChild(i){
        return 2*i+2;
    }
    peek(){
        return this.data[0];
    }
    insert(v){
        let i = this.getSize();
        this.data.push(v);
        this.shiftUp(i);
    }
    remove(){
        let v = this.data[0];
        if(this.data.length > 1){
            this.data[0] = this.data.pop();
            this.shiftDown(0);
        }else this.data.pop();
        return v;
    }
}

class MaxHeap extends Heap{
    constructor(arr = []){
        super(arr);
        this.buildHeap();
    }
    buildHeap(){
        for(let i = Math.floor((this.data.length-1)/2);i >= 0;i--){
            this.shiftDown(i);
        }
    }
    shiftUp(i){
        let j = this.parent(i);
        let t = this.data[i];
        while(i > 0 && this.data[j] < t){
            this.data[i] = this.data[j];
            i = j;
            j = this.parent(i);
        }
        this.data[i] = t;
    }
    shiftDown(i){
        let j = this.leftChild(i);
        j = (j < this.data.length-1 && this.data[j] < this.data[j+1])?j+1:j;
        let t = this.data[i];
        while(j < this.data.length && this.data[j] > t){
            this.data[i] = this.data[j];
            i = j;
            j = this.leftChild(i);
            j = (j < this.data.length-1 && this.data[j] < this.data[j+1])?j+1:j;
        }
        this.data[i] = t;
    }
    removeByIndex(i){
        this.data[i] = this.data.pop();
        if(this.data[(i-1)/2|0] > this.data[i])this.shiftDown(i);
        else this.shiftUp(i);
    }
    replace(i,v){
        this.data[i] = v;
        if(this.data[(i-1)/2|0] > this.data[i])this.shiftDown(i);
        else this.shiftUp(i);
    }
}

class MinHeap extends Heap{
    constructor(arr = []){
        super(arr);
        this.buildHeap();
    }
    buildHeap(arr){
        for(let i = Math.floor((this.data.length-1)/2);i >= 0;i--){
            this.shiftDown(i);
        }
    }
    shiftUp(i){
        let j = this.parent(i);
        let t = this.data[i];
        while(i > 0 && this.data[j] > t){
            this.data[i] = this.data[j];
            i = j;
            j = this.parent(i);
        }
        this.data[i] = t;
    }
    shiftDown(i){
        let j = this.leftChild(i);
        j = (j < this.data.length-1 && this.data[j] > this.data[j+1])?j+1:j;
        let t = this.data[i];
        while(j < this.data.length && this.data[j] < t){
            this.data[i] = this.data[j];
            i = j;
            j = this.leftChild(i);
            j = (j < this.data.length-1 && this.data[j] > this.data[j+1])?j+1:j;
        }
        this.data[i] = t;
    }
    removeByIndex(i){
        this.data[i] = this.data.pop();
        if(this.data[(i-1)/2|0] < this.data[i])this.shiftDown(i);
        else this.shiftUp(i);
    }
    replace(i,v){
        this.data[i] = v;
        if(this.data[(i-1)/2|0] < this.data[i])this.shiftDown(i);
        else this.shiftUp(i);
    }
}

export {MaxHeap,MinHeap}