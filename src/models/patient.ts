import mongoose, { Schema, Model, Document } from "mongoose";

export enum EPetType {
  CAT = "CAT",
  DOG = "DOG",
  BIRD = "BIRD",
}

export interface IPatient extends Document {
  petName: string;
  petType: EPetType;
  ownerName: string;
  ownerAddress: string;
  ownerPhone: string;
}

const PatientSchema = new mongoose.Schema<IPatient>({
  petName: {
    type: String,
    required: [true, "pet name is required"],
    minlength: 4,
    maxlength: 10,
  },
  petType: {
    type: String,
    enum: Object.values(EPetType), //to get all the values of an object as array
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerAddress: {
    type: String,
    required: true,
  },
  ownerPhone: {
    type: String,
    required: true,
  },
});

export default mongoose.model("patientCollection", PatientSchema);
