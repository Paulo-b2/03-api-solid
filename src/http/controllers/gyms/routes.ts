import type { FastifyInstance } from "fastify";

import { verifyJwt } from "../../middlewares/verify-jwt.js";

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', verifyJwt)
}
