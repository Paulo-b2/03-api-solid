import request from "supertest";
import { createApp } from "../../../app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";

let app: Awaited<ReturnType<typeof createApp>>;

describe("Nearby Gyms (e2e)", () => {
  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to list nearby gyms", async () => {
    const token = createAndAuthenticateUser(app);

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description.",
        phone: "119999999",
        latitude: -15.9537472,
        longitude: -44.8561152,
      });

    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "TypeScript Gym",
        description: "Some description.",
        phone: "119999999",
        latitude: -27.8610928,
        longitude: -49.5229501,
      });

    const response = await request(app.server)
      .get("/gyms/nearby")
      .query({
        latitude: -15.9537472,
        longitude: -44.8561152,
      })
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(response.body.gyms).toHaveLength(1);
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: "JavaScript Gym",
      }),
    ]);
  });
});
