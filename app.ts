import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import router from "./src/routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
    express.json(),
    cors({
        origin: process.env.CORS_ORIGIN || "http://localhost:8080",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization", "Credentials"],
        credentials: true
    }),
    cookieParser()
);

app.use(router)

export default app;