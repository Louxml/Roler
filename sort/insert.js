function insertSort(arr){
    for(let i = 1;i < arr.length;i++){
        let t = arr[i];
        let j = i;
        while(j > 0 && arr[j-1] > t)arr[j] = arr[--j];
        arr[j] = t;
    }
    return arr;
}

export default insertSort;