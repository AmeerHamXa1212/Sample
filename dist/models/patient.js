"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EPetType = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var EPetType;
(function (EPetType) {
    EPetType["CAT"] = "CAT";
    EPetType["DOG"] = "DOG";
    EPetType["BIRD"] = "BIRD";
})(EPetType || (exports.EPetType = EPetType = {}));
const PatientSchema = new mongoose_1.default.Schema({
    petName: {
        type: String,
        required: [true, "pet name is required"],
        minlength: 4,
        maxlength: 10,
    },
    petType: {
        type: String,
        enum: Object.values(EPetType),
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
exports.default = mongoose_1.default.model("patientCollection", PatientSchema);
