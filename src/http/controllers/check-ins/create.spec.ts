import request from "supertest";
import { createApp } from "../../../app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user.js";
import { getPrisma } from "@/lib/prisma.js";

let app: Awaited<ReturnType<typeof createApp>>;

describe("Create Check-in (e2e)", () => {
  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to create a check-in", async () => {
    const token = createAndAuthenticateUser(app);

    const prisma = getPrisma();

    const gym = await prisma.gym.create({
      data: {
        title: "JavaScript Gym",
        latitude: -15.9537472,
        longitude: -44.8561152,
      },
    });

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        latitude: -15.9537472,
        longitude: -44.8561152,
      });

    expect(response.statusCode).toEqual(201);
  });
});
