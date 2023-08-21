
// //Constructor Function
// function ConstFunc(name,age,profile){
//     this.name = name
//     this.age = age
//     this.profile = profile;

//     this.intro = function sayMyName() {
//         console.log(`Hi my name is ${this.name}`)
//     }
// }

// const newPerson = new ConstFunc("Hamza","22","CS Grad")
// console.log(newPerson)
// console.log(typeof newPerson)

//JS Class based Inheritance
class Code{
    constructor (name, level){
        this.name = name
        this.level = level
    }
    intro(){
        return `Hello I am a coder with name : "${this.name}" and i am at level : "${this.level}"`
    }
}

const c = new Code("HK",3)
//console.log(c)

class HeavyCoder extends Code{
    constructor (name,level, expertise) {
        super(name,level)
        this.expertise=expertise
    }
    codeExpertise (expertise) {
        return `My name is : ${this.name}  and I am proficent in following : ${this.expertise}`
}
}

const hc= new HeavyCoder("AH",5,["C++","JS","Python"])

//console.log(hc.codeExpertise())
console.log("verifying prototypal chain")
console.log(HeavyCoder.isPrototypeOf(Code))