import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { student } from "./types/student"

const app = express();
app.use(cors());
app.use(express.json());

const dataPath = path.join(__dirname, "data", "students.json");

// Helpers
const loadStudents = (): student[] => {
  const fileData = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(fileData);
};

const saveStudents = (students: student[]): void => {
  fs.writeFileSync(dataPath, JSON.stringify(students, null, 2));
};

// GET all students
app.get("/students", (req: Request, res: Response) => {
  res.json(loadStudents());
});

// ADD student
app.post("/students", (req: Request, res: Response) => {
  const students = loadStudents();

  const newStudent: student = {
    id: Date.now(),
    ...req.body,
  };

  students.push(newStudent);
  saveStudents(students);

  res.json(newStudent);
});

// UPDATE student
app.put("/students/:id", (req: Request, res: Response) => {
  const students = loadStudents();
  const id = Number(req.params.id);

  const updatedList = students.map((s: student) =>
    s.id === id ? { ...s, ...req.body } : s
  );

  saveStudents(updatedList);

  const updated = updatedList.find((s) => s.id === id);

  res.json(updated);
});

// DELETE student
app.delete("/students/:id", (req: Request, res: Response) => {
  const students = loadStudents();
  const id = Number(req.params.id);

  const filtered = students.filter((s: student) => s.id !== id);

  saveStudents(filtered);

  res.json({ message: "Deleted successfully" });
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});
