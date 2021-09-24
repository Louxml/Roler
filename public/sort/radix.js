function radixSort(arr){
    let max = arr[0];
    arr.forEach(v=>v>max&&(max=v));
    let k = max.toString().length;
    let dp = new Array(10).fill(0).map(v=>new Array(0));
    let r = 1;
    while(k--){
        arr.forEach(v=>dp[(v/r|0)%10].push(v));
        arr = [];
        dp.forEach(v=>arr=arr.concat(v))
        dp = dp.map(v=>new Array(0))
        r*=10;
    }
    return arr;
}

export default radixSort;