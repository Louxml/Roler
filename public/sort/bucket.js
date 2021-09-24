function bucketSort(arr){
    let min = arr[0];
    let max = arr[0];
    arr.forEach(v=>{
        if(v<min)min=v;
        if(v>max)max=v;
    })
    if(min==max)return [...arr];
    let len = arr.length;
    let range = max-min;
    // let count = Math.min(range+1,Math.max((range/len|0)+1,len));
    let count = 100;
    let size = (range/count|0)+1;
    let bucket = new Array(count).fill(0).map(v=>new Array(0));
    let res = [];
    arr.forEach(v => {bucket[(v-min)/size|0].push(v)});
    bucket.forEach(o=>o.length>1?bucketSort(o).map(v=>res.push(v)):o.map(v=>res.push(v)));
    return res;
}

export default bucketSort;