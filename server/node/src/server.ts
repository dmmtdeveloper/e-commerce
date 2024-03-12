import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { corsOptions } from "./config/corsOptions";
import userRouter from "./routes/users";

config();

const PORT = process.env.PORT;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/ping", (_req, res) => {
  console.log("someone pinged here!");
  res.json({message: "Service OK"})
});

app.use("/api", userRouter)

// const server = http.createServer(app)

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
