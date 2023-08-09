numbers = [1,3,-4,7]
const res = numbers.reduce((acc,currVal)=> {return acc+currVal},0)
console.log (res)

//array of objects
const array= [
    {id:1,name:"Bilal", city:"Lahore"},
    {id:1,name:"Bilal", city:"Lahore"},
    {id:3,name:"Hafsa", city:"Karachi"},
    {id:4,name:"Rehan", city:"Lahore"},
    {id:5,name:"Saqib", city:"Karachi"},
    {id:6,name:"Farhan", city:"Islamabad"}
    ]

    function groupByReduce(array, key) {
        return array.reduce((accum, currValue) => {
          const groupKey = currValue[key];
          if (!accum[groupKey]) {
            accum[groupKey] = [];
          }
          accum[groupKey].push(currValue);
          return accum;
        }, {});
      }
      
      const groupedData = groupByReduce(array, "city");
      console.log(groupedData);
      