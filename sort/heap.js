function swap(data,i,j){
    let t = data[i];
    data[i] = data[j];
    data[j] = t;
}

function heapSort(arr){
    buildHeap(arr);
    for(let i = arr.length-1;i > 0;i--){
        swap(arr,0,i);
        heapify(arr,0,i);
    }
    return arr;
}

function buildHeap(arr){
    for(let i = Math.floor((arr.length-1)/2);i >= 0;i--){
        heapify(arr,i,arr.length);
    }
}

function heapify(data,i,end){
    let j = (2*i+2<end && data[2*i+2] > data[2*i+1])?2*i+2:2*i+1;
    let t = data[i];
    while(j < end && data[j] > t){
        data[i] = data[j];
        i = j;
        j = (2*i+2<end && data[2*i+2] > data[2*i+1])?2*i+2:2*i+1;
    }
    data[i] = t;
}

export default heapSort;