import type { FastifyInstance } from "fastify";
import { register } from "./controllers/register.js";
import { authenticate } from "./controllers/authenticate.js";
import { profile } from "./controllers/profile.js";
import { verifyJwt } from "./middlewares/verify-jwt.js";

// funciona como um plugin
export async function appRoutes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  //Authenticated
  app.get("/me", { onRequest: [verifyJwt] }, profile);
}
