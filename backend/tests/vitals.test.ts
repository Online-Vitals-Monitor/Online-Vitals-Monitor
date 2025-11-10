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

describe("PUT -> GET /api/vitals", () => {
  it("updates and reads back vitals", async () => {
    const data = { heartRate: 90, respRate: 18 };

    const put = await request(app).put("/api/vitals").send(data);
    expect(put.status).toBe(200);
    expect(put.body).toMatchObject(data);

    const get = await request(app).get("/api/vitals");
    expect(get.status).toBe(200);
    expect(get.body).toMatchObject(data);
  });
});

// check not implemented yet
// describe("PUT /api/vitals validation", () => {
//   it("rejects invalid vital data (negative rates)", async () => {
//     const res = await request(app)
//       .put("/api/vitals")
//       .send({heartRate: -1, respRate: 18});

//     expect(res.status).toBe(400);
//   });
// });
