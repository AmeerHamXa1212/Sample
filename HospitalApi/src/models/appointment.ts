import mongoose,{Schema,Model,Document} from "mongoose";

enum PaymentType {
    usd = "USD",
    eur = "EUR",
    bitcoin = "BITCOIN"
}

export interface IAppointments extends Document {
    startTime: Date,
    endTime :Date ,
    description:string,
    paymentMethod:PaymentType; 
    patientId?: mongoose.Types.ObjectId; //optional
    isPaid: boolean,
    paymentAmount:number

}

const AppointmentSchema = new mongoose.Schema<IAppointments>({
    startTime:{
        type:Date,
        required:[true,"Appointment Start Time is Required"]
    },
    endTime:{
        type:Date,
        required:[true,"Appointment End Time is Required"]
    },
    description:{
        type:String,
        required:true,
        minlength:10,
        maxlength:150
    },
    paymentMethod:{
        type:String,
        enum:Object.values(PaymentType),
        required:true
        
    },
    patientId: {
        //patient id is optional here, because we can have a case where an appointment does not have a patient 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'patientCollection', 
    },
    isPaid:{
        type:Boolean,
        required:true,
    },
    paymentAmount: {
        type: Number,
        required: true,
        validate: {
            validator: function(v: any) {
                return typeof v === 'number' && v > 0;
            },
            message: 'Payment amount must be a positive number'
        }
    }
})
export default mongoose.model('appointmentCollection', AppointmentSchema);

