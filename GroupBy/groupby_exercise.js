const array = [
  { id: 1, name: "Bilal", city: "Lahore" },
  { id: 1, name: "Bilal", city: "Lahore" },
  { id: 3, name: "Hafsa", city: "Karachi" },
  { id: 4, name: "Rehan", city: "Lahore" },
  { id: 5, name: "Saqib", city: "Karachi" },
  { id: 6, name: "Farhan", city: "Islamabad" },
];

function groupby(array, key) {
  grouped_items = {}; //becuase we are required to return the result in form of an object
  for (let i = 0; i < array.length; i++) {
    curr = array[i];

    key_item = curr[key];

    if (!grouped_items[key_item]) {
      grouped_items[key_item] = []; //if no entry exist against a particular key, make and empty list
    }
    grouped_items[key_item].push(curr);
  }
  return grouped_items;
}
const groupby_result = groupby(array, "city");
console.log(groupby_result);

//Output

//Group by City
// {
//     "Karachi" : [{id:3,name:"Hafsa", city:"Karachi"},{id:5,name:"Saqib", city:"Karachi"}],
//     "Lahore" : [
// {id:1,name:"Bilal", city:"Lahore"},
// {id:1,name:"Bilal",city:"Lahore"},{id:4,name:"Rehan", city:"Lahore"}]
//     "Islamabad" : [{id:6,name:"Farhan", city:"Islamabad"}]
// }

