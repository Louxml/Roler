function mergeSort(arr){
    partSort(arr,0,arr.length);
    return arr;
}

function partSort(arr,left,right){
    if(left == right-1)return;
    let mid = (left+right)/2|0;
    partSort(arr,left,mid);
    partSort(arr,mid,right);
    merge(arr,left,mid,right);
}

function merge(arr,left,mid,right){
    let temp = [];
    let i = left;
    let j = mid;
    while(i < mid && j < right)temp.push(arr[i]<=arr[j]?arr[i++]:arr[j++]);
    while(i<mid)temp.push(arr[i++]);
    while(j<right)temp.push(arr[j++]);
    for(i = 0;i < temp.length;i++)arr[left+i] = temp[i];
}

export default mergeSort;