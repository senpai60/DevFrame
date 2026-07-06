import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import corsConfig from "./config/cors.config.js";
import mainRouter from "./src/routes.js";
import passport from "./config/passport.js";

const app = express();

app.use(express.json());
app.use(corsConfig);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(passport.initialize());

app.use("/api/v1", mainRouter);

export default app;
