// //promises
// let pro1 = new Promise((resolve,rejected)=>{
//     let p = false
//     console.log("Inside Promise")
//     setTimeout(()=>{
//         if(p){
//             resolve("Promise Resolved")
//         }
//         else{
//             rejected('Promise Rejected')
//         }
//     },5000)
//     console.log("This code is after call back")
// })

const { resolve } = require("path");

// // pro1.then((res)=>console.log(res))
// //     .catch((rej)=>console.log(rej))
// //     .finally(()=>console.log("I will run anyway - finally block"))

// let pro2 = new Promise((res,rej)=>{
//     let name = "Hamza"
//     res(`Hi ${name}, I am Promise`)
//     rej(`Bye ${name}`)
// })

// pro2.then((r)=>console.log(r))
//     .catch((r)=>console.log(r))
//     .finally(()=>console.log("I will run anyway - finally block"))

//---> Async/Await
// async function fun (){
// let f = async function waitForPromise() {
//     // This Promise will never resolve
//     console.log("Entering Promise")
//     return new Promise((resolve, reject) => {});
// }
//     await f()
//     console.log("This code runs after await for the async function is completed")
// }
// console.log(fun())

// async function f1(){
//     return new Promise ((res,rej)=>{
//         console.log("Entering Promise")

//         setTimeout(()=>{
//         let p = Math.random()
//         if (p<0.5){res(`Function Resolved, and P : ${p}`)}
//         rej(`Function rejected, and P : ${p}`)
//         },2000)

//     })
// }
// async function doWork(){
//     try{
//         const result=await f1();
//         console.log(result)
//     }
//     catch(e){
//         console.log(e)
//     }
// }

// //doWork()

// Promise.resolve("Hi There !")
// .then(res => {console.log(res,"1") //to pass a value from one then to another then use returns
// return res})
// .then(res =>{console.log(res)})
// var fetch = require("node-fetch");

// const url = "https://jsonplaceholder.typicode.com/posts";
// async function getData() {
//   const fetch = await import("node-fetch");

//   console.log("Before resolution of promise");
//   try {
//     let resp = await fetch.default(url);
//     const data = await resp.json();
//     console.log("returned after resolution of promise", data);
//     a();
//   } catch (e) {
//     console.log("Error Ocuured : ", e);
//   }
// }
// function a() {
//   for (let i = 0; i < 500; i++) {
//     console.log(i);
//   }
// }
// getData();

// async function dummy() {
//   console.log("1");
// }
// async function dummy2() {
//   setTimeout(() => {
//     console.log("B");
//   }, 1000);
//   await new Promise((res, rej) => {
//     console.log("A");
//     res("Promise resolved");
//   });
//   dummy();
// }
// async function dummy3() {
//   setTimeout(dummy2, 1000);
//   dummy();
// }

// // dummy3();

// async function doSomething() {
//   try {
//     console.log("1");
//     await Promise.resolve("Resolved!");
//     console.log("2");
//     throw new Error("Error!");
//   } catch (error) {
//     console.log("3", error);
//     return "Caught";
//   } finally {
//     console.log("4");
//   }
// }

// console.log("5");
// doSomething().then((result) => console.log("6", result));
// console.log("This and below code works when promise is on wait");
// console.log("7");

// function getNumber() {
//   return new Promise((resolve, reject) => {
//     resolve(42);
//   });
// }

// async function calculateSum() {
//   let sum = 0;
//   sum += await getNumber();
//   sum += await getNumber();
//   console.log("Sum:", sum);
//   console.log("End");
// }

// console.log("Start");
// calculateSum();
// console.log("Waiting .. !");

async function bar() {
  console.log("A");
  await new Promise((resolve) => setTimeout(resolve, 2000));
  console.log("B");
}

async function baz() {
  console.log("X");
  await bar();
  console.log("Y");
}

// console.log("Start");
// baz();
// console.log("End");

// async function test() {
//   console.log("1");
//   await new Promise((resolve, reject) => {
//     setTimeout(() => {
//       console.log("2");
//       resolve();
//     }, 0);
//   });
//   console.log("3");
// }
// test();

// (async function test() {
//   console.log("1");
//   await setTimeout(() => {
//     console.log("2");
//   }, 0);
//   console.log("3");
// })();

// function sleep(ms) {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

// async function baz(input) {
//   console.log("4");
//   await sleep(1000);
//   console.log("5");
//   return input;
// }

// async function bar(input) {
//   console.log("3");
//   return await baz(input);
// }

// async function foo() {
//   console.log("2");
//   const foo = await bar("foo");
//   return foo;
// }

// (async () => {
//   console.log("1");
//   const str = await foo();
//   console.log("6");
//   console.log(str);
// })();

const getUserData = async () => {
  const fetch = await import("node-fetch");
  //parallelize the two unrelated await requests to make execution a little faster
  // only if the subsequent function calls depend on each other, then its good to await all of them in a sequence
  try {
    const [res, user] = await Promise.all([
      fetch.default("https://dog.ceo/api/breeds/image/random"),
      fetch.default("https://randomuser.me/api"),
    ]);

    const [message, results] = await Promise.all([res.json(), user.json()]);

    return [message, results];
  } catch (error) {
    console.error("Error occurred:", error);
    throw error; // Rethrow the error to propagate it to the calling code
  }
};

async function main() {
  try {
    const data = await getUserData();
    const [message, results] = data;
    console.log("Message:", message);
    console.log("Results:", results);
  } catch (e) {
    console.log(e);
  }
}

main();
