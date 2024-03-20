import express from "express";
import http from 'http'
import cors from "cors";
import { corsOptions } from "./config/corsOptions";
import userRouter from "./routes/users";
import { config } from "dotenv";

config();

const PORT = process.env.PORT;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.json({message: "Service OK"})
});

app.use("/api", userRouter)

const server = http.createServer(app)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
