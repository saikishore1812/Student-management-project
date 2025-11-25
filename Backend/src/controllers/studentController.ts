import { Request, Response } from "express";
import pool from "../db";

// GET all students
export const getStudents = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM students");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error fetching students" });
  }
};

// ADD a new student
export const addStudent = async (req: Request, res: Response) => {
  const { name, age, gender, course, email } = req.body;

  try {
    const [result]: any = await pool.query(
      "INSERT INTO students (name, age, gender, course, email) VALUES (?, ?, ?, ?, ?)",
      [name, age, gender, course, email]
    );

    res.json({
      id: result.insertId,
      name,
      age,
      gender,
      course,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding student" });
  }
};

// UPDATE student
export const updateStudent = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, age, gender, course, email } = req.body;

  try {
    await pool.query(
      "UPDATE students SET name=?, age=?, gender=?, course=?, email=? WHERE id=?",
      [name, age, gender, course, email, id]
    );

    res.json({
      id: Number(id),
      name,
      age,
      gender,
      course,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating student" });
  }
};

// DELETE student
export const deleteStudent = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM students WHERE id=?", [id]);
    res.json({ message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting student" });
  }   
};
