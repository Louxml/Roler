function countSort(arr){
    let min = arr[0];
    let max = arr[0];
    arr.forEach(v=>{
        if(v<min)min=v;
        if(v>max)max=v;
    })
    let count = new Array(max-min+1).fill(0);
    for(let i = 0;i < arr.length;i++)count[arr[i]-min]++;
    for(let i = 0,k = 0;i < count.length;i++)
        while(count[i]--)arr[k++]=i+min;
    return arr;
}

export default countSort;