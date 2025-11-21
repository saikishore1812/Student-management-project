import express from "express";
import cors from "cors";
import studentRoutes from "./routes/studentRoutes";

const app = express();
app.use(cors());
app.use(express.json());

// Use the MySQL routes
app.use("/students", studentRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
