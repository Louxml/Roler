function swap(arr,i,j){
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
}

function bubbleSort(arr){
    for(let i = 1;i < arr.length;i++){
        for(let j = 0;j+i<arr.length;j++){
            if(arr[j] > arr[j+1])swap(arr,j,j+1);
        }
    }
    return arr;
}

export default bubbleSort;