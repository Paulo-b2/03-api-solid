import request from "supertest";
import { createApp } from "../../../app.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

let app: Awaited<ReturnType<typeof createApp>>;

describe("Register (e2e)", () => {
  beforeAll(async () => {
    app = await createApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should be able to register", async () => {
    const response = await request(app.server).post("/users").send({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    expect(response.statusCode).toEqual(201);
  });
});
