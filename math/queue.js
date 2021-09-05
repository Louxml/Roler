class Queue{
    constructor(){
        this.data = [];
    }
    push(a){
        this.data.push(a);
    }
    shift(){
        return this.data.shift();
    }
    top(){
        return this.data[0];
    }
    size(){
        return this.data.length;
    }
    clear(){
        this.data = [];
    }
}

export default Queue;