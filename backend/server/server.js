import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import visitRoutes from "./routes/visitRoutes.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

await connectDB();

app.use("/api/users", userRoutes);
app.use("/api/visits", visitRoutes);

app.get("/", (req, res) => {
  res.send("Server works");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
