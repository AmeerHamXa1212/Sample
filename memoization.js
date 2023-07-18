function add(n){
    n = n+1
    return n;
}

// console.log(add(5))
// console.log(add(5))
// console.log(add(5))

resultCache ={}
function memoizedAdd(n){
    if (n in resultCache){
        return resultCache[n]
    }
    else{
        console.log("Calculating...")
        
        resultCache[n] = n +1
        setTimeout(()=>{},5000) //an example that the calculation might take much time
        return resultCache[n]
    }
}
console.log("1: ",memoizedAdd(5))
console.log("2: ",memoizedAdd(5))
console.log(memoizedAdd(6))
console.log(resultCache)