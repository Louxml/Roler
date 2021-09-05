function swap(arr,i,j){
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
}
function selectSort(arr){
    for(let i = 0;i < arr.length - 1;i++){
        let k = i;
        for(let j = i+1;j < arr.length;j++){
            if(arr[j] < arr[k])k = j;
        }
        if(i != k)swap(arr,i,k);
    }
    return arr;
}

export default selectSort;