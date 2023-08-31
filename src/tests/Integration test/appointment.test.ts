import request from "supertest";
import app from "../../app";
import mongoose from "mongoose";
import appointmentModel from "../../models/appointment";

describe("Appointment Routes - Integration Testing", () => {
  beforeAll(async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/HospitalAPI-ahk", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await appointmentModel.deleteMany({});
  });

  it("should create an appointment", async () => {
    const patientData = {
      petName: "TPet 3",
      petType: "BIRD",
      ownerName: "Owner3",
      ownerAddress: "Address3",
      ownerPhone: "12345690-3",
    };

    const patientResponse = await request(app)
      .post("/patients")
      .send(patientData);

    const patientId = patientResponse.body._id;

    const appointmentData = {
      startTime: new Date(),
      endTime: new Date(),
      description: "Test appointment",
      paymentMethod: "USD",
      isPaid: false,
      paymentAmount: 50,
      patientId: patientId,
    };

    const response = await request(app)
      .post("/appointments")
      .send(appointmentData);

    expect(response.status).toBe(201);
    expect(response.body.description).toBe(appointmentData.description);
  });

  it("should handle invalid appointment data", async () => {
    const patientData = {
      petName: "TPet 3",
      petType: "BIRD",
      ownerName: "Owner3",
      ownerAddress: "Address3",
      ownerPhone: "12345690-3",
    };
    const patientResponse = await request(app)
      .post("/patients")
      .send(patientData);

    const patientId = patientResponse.body._id;

    const invalidAppointmentData = {
      // Incomplete appointment data
      startTime: new Date(),
      description: "Invalid appointment",
      paymentMethod: "USD",
      patientId: patientId,
      isPaid: false,
      paymentAmount: -10,
    };

    const response = await request(app)
      .post("/appointments")
      .send(invalidAppointmentData);

    expect(response.status).toBe(500);
  });

  it("should delete an appointment", async () => {
    const appointmentData = {
      startTime: new Date(),
      endTime: new Date(),
      description: "Test appointment",
      paymentMethod: "USD",
      isPaid: false,
      paymentAmount: 50,
      //patientId: "12234425241",
    };

    const appointmentResponse = await request(app)
      .post("/appointments")
      .send(appointmentData);

    // Log the response body to see its structure
    console.log(appointmentResponse.body);

    // Update this line based on the actual structure of the response
    const appointmentId = appointmentResponse.body._id;

    const deleteAppoint = await request(app).delete(
      "/appointments/" + appointmentId
    );
    expect(deleteAppoint.status).toBe(200);
    expect(deleteAppoint.body.message).toBe("Appointment deleted successfully");
  });

  it("should update an appointment", async () => {
    const appointmentData = {
      startTime: new Date(),
      endTime: new Date(),
      description: "Test appointment",
      paymentMethod: "USD",
      isPaid: false,
      paymentAmount: 50,
    };
    const appointmentResponse = await request(app)
      .post("/appointments")
      .send(appointmentData);

    const appointmentId = appointmentResponse.body._id;

    // Update the appointment
    const updatedAppointmentData = {
      description: "Updated description",
    };

    const updateResponse = await request(app)
      .patch(`/appointments/${appointmentId}`)
      .send(updatedAppointmentData);

    expect(updateResponse.status).toBe(200);
    expect(updateResponse.body.message).toBe(
      "Appointment updated successfully"
    );
    // Verify that the appointment was updated
    const fetchUpdatedAppointment = await request(app).get(
      `/appointments/${appointmentId}`
    );

    //verify updated fetched document to be equal to update made by user
    expect(fetchUpdatedAppointment.status).toBe(200);
    expect(fetchUpdatedAppointment.body.description).toBe(
      updatedAppointmentData.description
    );
  });

  it("should get all appointments", async () => {
    appointmentModel.collection.insertMany([
      {
        startTime: new Date(),
        endTime: new Date(),
        description: "Test appointment",
        paymentMethod: "USD",
        isPaid: false,
        paymentAmount: 50,
      },
      {
        startTime: new Date(),
        endTime: new Date(),
        description: "Test appointment",
        paymentMethod: "EUR",
        isPaid: true,
        paymentAmount: 14,
      },
    ]);

    const response = await request(app).get("/appointments");
    expect(response.status).toBe(200);
  });

  it("should handle the case when there are no Appointments", async () => {
    const response = await request(app).get("/allAppointments");
    console.log("response", response.body);
    //expect(response.body).toHaveLength(0);
    expect(response.status).toBe(404);
  });

  it("should get unpaid appointments", async () => {
    // Createing and insert unpaid appointments before testing this route
    appointmentModel.collection.insertMany([
      {
        startTime: new Date(),
        endTime: new Date(),
        description: "Test appointment",
        paymentMethod: "USD",
        isPaid: false,
        paymentAmount: 50,
      },
      {
        startTime: new Date(),
        endTime: new Date(),
        description: "Test appointment",
        paymentMethod: "EUR",
        isPaid: false,
        paymentAmount: 14,
      },
    ]);
    const response = await request(app).get("/appointments");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
  });

  it("should handle the case when there are no unpaid appointments", async () => {
    // Clearing existing data
    await appointmentModel.deleteMany({});
    const response = await request(app).get("/appointments");
    expect(response.status).toBe(404);
  });

  it("should get total remaining bill for unpaid appointments", async () => {
    const response = await request(app).get("/unpaidappointments");

    expect(response.status).toBe(200);
    expect(response.body).toMatch(/Total Remaining Bill \d+/);
  });

  it("should handle the case when there are NO unpaid appointments", async () => {
    const response = await request(app).get("/unpaidappointments");
    expect(response.status).toBe(404);
  });

  it("should get appointments for a given date", async () => {
    const appointmentData = {
      startTime: new Date("2023-08-28T10:00:00Z"),
      endTime: new Date("2023-08-28T11:00:00Z"),
      description: "Test appointment",
      paymentMethod: "USD",
      isPaid: false,
      paymentAmount: 50,
    };
    await appointmentModel.create(appointmentData);
    const response = await request(app).get("/appointments/date/2023-08-28");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it("should handle the case when there are no appointments for a given date", async () => {
    const response = await request(app).get("/appointments/date/2023-08-29");
    expect(response.status).toBe(404);
  });
});
