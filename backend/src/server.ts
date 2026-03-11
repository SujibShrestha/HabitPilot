import express, { type Request, type Response } from "express";
import cors from "cors";
import { prisma } from "./config/db.js";
import { config } from "dotenv";
import authRoute from "./routes/auth.route.js";
import profileRoute from "./routes/profile.route.js"
import corsOptions from "./config/cors.js";

config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors(corsOptions));

//Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/profile",profileRoute)

app.get("/", (req: Request, res: Response) => {
  res.send("Api is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});
