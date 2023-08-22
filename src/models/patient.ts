import mongoose,{Schema,Model,Document} from "mongoose";

export enum PetType {
    cat = "cat",
    dog = "dog",
    bird = "bird"
}

export interface IPatient extends Document{
    petName : string,
    petType : PetType,
    ownerName : string,
    ownerAddress : string,
    ownerPhone : string
}

const PatientSchema = new mongoose.Schema<IPatient> ({
    petName:{
        type:String ,
        required:[true,"pet name is required"],
        minlength:4,
        maxlength:10
    },
    petType:{
        type:String,
        enum:Object.values(PetType), //to get all the values of an object as array
        required:true
    },
    ownerName:{
        type: String,
        required:true
    },
    ownerAddress:{
        type:String,
        required:true
    },
    ownerPhone:{
        type:String,
        required:true
    }
})

export default mongoose.model('patientCollection', PatientSchema);
