import { createServer } from "http";
import app from "./app.js";
import { ENV_CONFIG } from "./config/env.config.js";
import { connectDB } from "./config/db.config.js";

await connectDB();

const server = createServer(app);

server.listen(ENV_CONFIG.PORT, () =>
  console.log(`server is running on http://localhost:${ENV_CONFIG.PORT}`),
);
