function swap(arr,i,j){
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
}

function quickSort(arr){
    partSort(arr,0,arr.length-1);
    return arr;
}
function partSort(arr,left,right){
    if(left>=right)return;
    let mid = quick(arr,left,right);
    partSort(arr,left,mid-1);
    partSort(arr,mid+1,right);
}

function quick(arr,left,right){
    let p = arr[right];
    let i = left;
    let j = right-1;
    do{
        while(i < right && arr[i] <= p)i++;
        while(j > left && arr[j] > p)j--;
        if(i < j)swap(arr,i,j);
    }while(i<j);
    if(i != right)swap(arr,i,right);
    return i;
}


export default quickSort;