"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
// import { MongoMemoryServer } from "mongodb-memory-server";
const mongoose_1 = __importDefault(require("mongoose"));
const patient_1 = __importDefault(require("../../models/patient"));
beforeAll(async () => {
    await mongoose_1.default.connect("mongodb://127.0.0.1:27017/HospitalAPI-ahk", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});
afterAll(async () => {
    await mongoose_1.default.disconnect(); // Disconnect the Mongoose connection
});
afterEach(async () => {
    await patient_1.default.deleteMany({});
});
describe("Patients Routes - Integration Testing", () => {
    it("should get all patients", async () => {
        patient_1.default.collection.insertMany([
            {
                petName: "TPet 1",
                petType: "DOG",
                ownerName: "Owner1",
                ownerAddress: "Address1",
                ownerPhone: "12345690-1",
            },
            {
                petName: "TPet 2",
                petType: "DOG",
                ownerName: "Owner2",
                ownerAddress: "Address2",
                ownerPhone: "12345690-2",
            },
        ]);
        const response = await (0, supertest_1.default)(app_1.default).get("/patients");
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2); // Move this line below the status assertion
    });
    it("should handle the case when there are no patients", async () => {
        const response = await (0, supertest_1.default)(app_1.default).get("/patients");
        expect(response.status).toBe(404);
    });
    it("should delete a patient", async () => {
        const patient = patient_1.default.create({
            petName: "TPet 3",
            petType: "BIRD",
            ownerName: "Owner3",
            ownerAddress: "Address3",
            ownerPhone: "12345690-3",
        });
        const response = await (0, supertest_1.default)(app_1.default).delete(`/patients/${(await patient)._id}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Patient deleted successfully");
        const deletedPatient = await patient_1.default.findById((await patient)._id);
        expect(deletedPatient).toBeNull();
    });
    it("should create a patient", async () => {
        const patient = {
            petName: "TPet 3",
            petType: "BIRD",
            ownerName: "Owner3",
            ownerAddress: "Address3",
            ownerPhone: "12345690-3",
        };
        const response = await (0, supertest_1.default)(app_1.default).post("/patients").send(patient);
        expect(response.status).toBe(201);
        expect(response.body.petName).toBe(patient.petName);
    });
    it("should handle error in create", async () => {
        const invalidPatientData = {
            // Incomplete patient data
            petName: "InvalidPet",
            petType: "DOG",
        };
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/patients")
            .send(invalidPatientData);
        expect(response.status).toBe(400);
    });
});
