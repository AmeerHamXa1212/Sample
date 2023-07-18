const compose = (...functions) => {
    return (input) => {
      return functions.reduceRight((acc, fn) => {
        return fn(acc);
      }, input);
    };
  };
  
const pipe = (...functions) => { //takes any number of functions as arguments using the rest parameter syntax (...functions).
    return function (input) {
      let result = input;
      for (let i = 0; i < functions.length; i++) {
        result = functions[i](result);
      }
      return result;
    };
  };
  
const mul5 = (num) => {console.log("Multiplying with 5") 
return num *5}
const add10 = (num)=> {console.log("Adding with 10")
return num+10}
const takeAbs =(num)=> {console.log("Taking Absolute")
return Math.abs(num)}

const pipeFn = pipe(mul5,add10,takeAbs)
const composedFn = compose(mul5,add10,takeAbs)
const comp = composedFn(-13)
const pip = pipeFn(-13)

console.log("\nPipe Function \n",pip)
console.log("\nComposed Function \n",comp)