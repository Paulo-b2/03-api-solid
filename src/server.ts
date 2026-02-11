import { createApp } from "./app.js";
import { env } from "./env/index.js";

const startServer = async () => {
  const app = await createApp();

  await app.listen({
    host: "0.0.0.0",
    port: env.PORT,
  });

  console.log("🚀 HTTP Server Running!");
};

startServer();
