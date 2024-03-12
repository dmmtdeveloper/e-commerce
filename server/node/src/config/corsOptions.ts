import { enviroment } from "./enviroments";

const whiteList = ["http//localhost:4000", "http://localhost:3000"];

export const corsOptions = {
    origin: enviroment === "development" ? whiteList : "https://example.com"
}