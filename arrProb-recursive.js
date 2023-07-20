function recursiveLinkingObjects(array, startId) {
    const result = array.find(obj => obj.id === startId);
  
    if (!result) {
      return null; 
    }
  
    const nextId = result.next;
    if (nextId !== null) {
      result.value = recursiveLinkingObjects(array, nextId);
    }
  
    return result;
  }



  const array = [
    { id: 'two', next: 'three', value: null },
    { id: 'one', next: 'two', value: null },
    { id: 'three', next: null, value: null }
  ];

  array.forEach(obj=>{
  console.log(recursiveLinkingObjects(array, obj.id));

  })
  //console.log(recursiveSortObjects(array, ''));
  