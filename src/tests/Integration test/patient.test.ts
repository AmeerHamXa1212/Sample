import request from "supertest";
import app from "../../app";
// import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import patientModel from "../../models/patient";

beforeAll(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/HospitalAPI-ahk", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
});

afterAll(async () => {
  await mongoose.disconnect(); // Disconnect the Mongoose connection
});

afterEach(async () => {
  await patientModel.deleteMany({});
});

describe("Patients Routes - Integration Testing", () => {
  it("should get all patients", async () => {
    patientModel.collection.insertMany([
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
    const response = await request(app).get("/patients");
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2); // Move this line below the status assertion
  });

  it("should handle the case when there are no patients", async () => {
    const response = await request(app).get("/patients");
    expect(response.status).toBe(404);
  });

  it("should delete a patient", async () => {
    const patient = patientModel.create({
      petName: "TPet 3",
      petType: "BIRD",
      ownerName: "Owner3",
      ownerAddress: "Address3",
      ownerPhone: "12345690-3",
    });
    const response = await request(app).delete(
      `/patients/${(await patient)._id}`
    );
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Patient deleted successfully");

    const deletedPatient = await patientModel.findById((await patient)._id);
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
    const response = await request(app).post("/patients").send(patient);
    expect(response.status).toBe(201);
    expect(response.body.petName).toBe(patient.petName);
  });

  it("should handle error in create", async () => {
    const invalidPatientData = {
      // Incomplete patient data
      petName: "InvalidPet",
      petType: "DOG",
    };

    const response = await request(app)
      .post("/patients")
      .send(invalidPatientData);

    expect(response.status).toBe(400);
  });
});
