import request from "supertest";
import { createApp } from "../../../app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";

let app: Awaited<ReturnType<typeof createApp>>;

describe("Create Gym (e2e)", () => {
  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a gym", async () => {
    const token = createAndAuthenticateUser(app);

    const response = await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "JavaScript Gym",
        description: "Some description.",
        phone: "119999999",
        latitude: -15.9537472,
        longitude: -44.8561152,
      });

    expect(response.statusCode).toEqual(201);
  });
});
