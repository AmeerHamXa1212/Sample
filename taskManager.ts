enum EPriority {
    Urgent = "urgent",
    High = "high",
    Important = "important",
    NotRelevent = "not-relevent",
  }
  
  interface ITask {
    name: string;
    description?: string | null;
    completionStatus: boolean;
    priority: EPriority;
  }
  
  const TaskArray: ITask[] = [];
  
  function addTask(name: string, completionStatus: boolean, priority: EPriority, description?: string): void {
    const task: ITask = {
      name: name,
      description: description || null,
      completionStatus: completionStatus,
      priority: priority,
    };
    TaskArray.push(task);
  }
  
  function displayTask(taskList: ITask[]): ITask[] {
    if (taskList.length !== 0) {
      return taskList;
    }
    return [];
  }
  
  function updateTaskStatus(taskName: string, newStatus: boolean): ITask[] {
    const taskIndex = TaskArray.findIndex((task) => task.name === taskName);
    if (taskIndex !== -1) {
      TaskArray[taskIndex].completionStatus = newStatus;
      if (newStatus) {
        console.log(`Task : "${taskName}" marked as completed.`);
        return removeCompletedTasks();
      }
    }
    return TaskArray;
  }
  
  function removeCompletedTasks(): ITask[] {
    const completedTaskIndices: number[] = [];
    TaskArray.forEach((task, index) => {
      if (task.completionStatus) {
        completedTaskIndices.push(index);
      }
    });
  
    if (completedTaskIndices.length > 0) {
      console.log(`Removing completed tasks:`);
      completedTaskIndices.reverse().forEach((index) => {
        console.log(`- "${TaskArray[index].name}"`);
        TaskArray.splice(index, 1);
      });
    }
  
    return TaskArray;
  }
  
  addTask("Buy Toys", false, EPriority.Important, "Buy Plastic Toys!");
  addTask("Buy Milk", true, EPriority.High, "Buy 2 cartons");
  
  console.log("Initial Task List:", displayTask(TaskArray));
  
  // Mark "Buy Milk" as completed and remove completed tasks
  console.log("Updated Task List:", updateTaskStatus("Buy Milk", true));
  