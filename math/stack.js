class Stack{
    constructor(){
        this.data = [];
    }
    push(a){
        this.data.push(a);
    }
    pop(){
        return this.data.pop();
    }
    top(){
        return this.data[this.data.length-1];
    }
    size(){
        return this.data.length;
    }
    clear(){
        this.data = [];
    }
}
export default Stack;