import * as mongoose from 'mongoose'
//load data
import * as fs from 'fs/promises'

const dbURL = 'mongodb://127.0.0.1:27017/mosh-exercise-1'
const connection = mongoose.connect(dbURL)
    .then(()=>console.log("Connection to { mosh-exercise-1 } DB Successful"))
    .catch((err)=>console.error("Error in DB Connection : ", err))
console.log("This is finally block")

//create an interface to maintain type validation consistent
interface ICourse extends mongoose.Document {
    name: string,
    author:string
    price: number,
    date: Date,
    tags : string[],
    isPublished : boolean
}

//schema definition
const SchemaD = mongoose.Schema
let courseSchema= new SchemaD<ICourse>({
    
    tags: [{type: String, required:true}],//array of objects(degrees)
    date:{type:Date},
    name: {type: String, required:true},
    author: {type: String, required:true},
    isPublished: {type: Boolean, required:true},
    price: {type: Number, required:true}
})

const CourseModel = mongoose.model("Course",courseSchema)

async function insertCoursesFromFile() {
    try {
      const jsonData = await fs.readFile('data.json', 'utf8');
      const courses = JSON.parse(jsonData);
  
      const result = await CourseModel.insertMany(courses);
      console.log(`${result.length} courses inserted successfully.`);
    } catch (error) {
      console.error('Error inserting courses:', error);
    } 
  }
  //insertCoursesFromFile()
  
  //display 
  async function displaySolution1(){
    try{
        const result = await CourseModel.find({ tags: { $in: ['backend'] },isPublished:'true' }).sort({name:1}).select('name author')
        console.log(`Following are ${result.length} courses with tags of Backend : `)
        return result
    }
    catch(err){
        console.error("Error occurred in fetching required data",err)
    }
}

async function displaySolution2(){
    try{
        const result = await CourseModel.find({ tags: { $in: ['backend','frontend'] },isPublished:'true' }).sort({price:-1}).select('name author')
        console.log(`Following are ${result.length} courses with tags of Backend and Frontend Sorted on Price :`)
        return result
    }
    catch(err){
        console.error("Error occurred in fetching required data",err)
    }
}

async function Main() {
    const Solution1 = await displaySolution1()
    console.log("Exercise 1 Solution :",Solution1)
    const Solution2 = await displaySolution2()
    console.log("Exercise 2 Solution :",Solution2)
}
Main();
