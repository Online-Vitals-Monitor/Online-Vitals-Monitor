import request from "supertest";
import app from "../src/server";

describe("GET /api/vitals", () => {
  it("returns vitals", async () => {
    const res = await request(app).get("/api/vitals");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("heartRate");
    expect(res.body).toHaveProperty("respRate");
  });
});
