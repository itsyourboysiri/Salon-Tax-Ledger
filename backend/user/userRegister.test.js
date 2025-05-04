const request = require("supertest");
const app = require("../server"); // Adjust path if needed


describe("POST /api/users/register", () => {
  it("should register a user successfully", async () => {
    const response = await request(app).post("/api/users/register").send({
      name: "Test User",
      dob: "1990-01-01",
      address: "123 Main St",
      phone: "0712345678",
      salonName: "Test Salon",
      salonAddress: "456 Salon Rd",
      username: "testuser",
      password: "Test@123",
      confirmPassword: "Test@123",
      stories: 2,
      area: [100, 200],
      nic: "123456789V",
      tinno: "123456789",
      email: "testuser@example.com"
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe("User registered successfully!");
  });

  it("should fail when required fields are missing", async () => {
    const response = await request(app).post("/api/users/register").send({
      username: "incompleteuser"
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("All fields are required");
  });
});
