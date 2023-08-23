"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentSchema = exports.PaymentType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var PaymentType;
(function (PaymentType) {
    PaymentType["usd"] = "USD";
    PaymentType["eur"] = "EUR";
    PaymentType["bitcoin"] = "BITCOIN";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
exports.AppointmentSchema = new mongoose_1.default.Schema({
    startTime: {
        type: Date,
        required: [true, "Appointment Start Time is Required"]
    },
    endTime: {
        type: Date,
        required: [true, "Appointment End Time is Required"]
    },
    description: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 150
    },
    paymentMethod: {
        type: String,
        enum: Object.values(PaymentType),
        required: true
    },
    patientId: {
        //patient id is optional here, because we can have a case where an appointment does not have a patient 
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'patientCollection',
    },
    isPaid: {
        type: Boolean,
        required: true,
    },
    paymentAmount: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return typeof v === 'number' && v > 0;
            },
            message: 'Payment amount must be a positive number'
        }
    }
});
exports.default = mongoose_1.default.model('appointmentCollection', exports.AppointmentSchema);
