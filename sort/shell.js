function shellSort(arr){
    let h = 1;

    while(h <= arr.length/3)h = h*3+1;

    while(h > 0){
        for(let i = h;i < arr.length;i++){
            let t = arr[i];
            let j = i;
            while(j >= h && arr[j-h] > t)arr[j] = arr[j-=h];
            arr[j] = t;
        }
        h = (h-1)/3;
    }
    return arr;
}
function shellSort2(){
    let h = arr.length / 2 | 0;
    while(h > 0){
        for(let i = h;i < arr.length;i++){
            let t = arr[i];
            let j = i;
            while(j >= h && arr[j-h] > t)arr[j] = arr[j-=h];
            arr[j] = t;
        }
        h = h/2|0;
    }
    return arr;
}

export default shellSort;