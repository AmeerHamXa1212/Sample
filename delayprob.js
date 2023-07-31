function customDelay1(ms) {
  const p = new Promise((res) => setTimeout(res, ms));

  return p;
}

async function runLoop1() {
  await customDelay1(1000);

  console.log("A");

  await customDelay1(3000);

  console.log("B");
}
runLoop1();

//..

//{ promisify } = require("util");

// const customDelay2 = promisify(setTimeout);

// async function runLoop2() {
//   await customDelay2(1000);
//   console.log("A");

//   await customDelay2(3000);
//   console.log("B");
// }
// console.log("With Promises");

// // console.log("With Promisify");
// // runLoop2();
