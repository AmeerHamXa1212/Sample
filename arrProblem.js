const array = [
    { id: 'one', next: 'two', value: null },
    { id: 'two', next: 'three', value: null },
    { id: 'three', next: null, value: null },
  ];

function arrProb(arr){
    elements =[]
    for (let i=0;i<arr.length;i++){
        elements[i]=arr[i]
        if (arr[i].next !== null && arr[i].next === arr[i+1].id){
        //console.log(arr[i].next)
        elements[i].value = arr[i+1]
        }
        else{
        elements[i].value = arr[i].value
        }
    }
    return elements
}
function arrProb_ForEach(array) {
    array.forEach((element, index) => {
      if (element.next !== null && element.next === array[index + 1].id) {
        element.value = array[index + 1];
      }
    });
    return array
}
// console.log("\nResultant Element Array is (using ForEach) : ", arrProb_ForEach(array));
console.log("\nResultant Element Array is (using For-Loop) : ",arrProb(array))
