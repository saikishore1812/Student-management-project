import { Request, Response } from "express";
import pool from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key"; // change to env variable in production

// SIGNUP LOGIC
export const signup = async (req: Request, res: Response) => {
  const { fullName, email, phone, city, password, role } = req.body;

  try {
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users(fullName, email, phone, city, password, role) VALUES (?, ?, ?, ?, ?, ?)",
      [fullName, email, phone, city, hashedPassword, role]
    );

    res.json({ message: "Signup successful!" });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error });
  }
};

// LOGIN LOGIC
export const login = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  try {
    const [rows]: any = await pool.query("SELECT * FROM users WHERE email=?", [
      email,
    ]);

    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const user = rows[0];

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    // check role
    if (user.role !== role)
      return res.status(400).json({ message: "Role mismatch" });

    // generate JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, fullName: user.fullName, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error });
  }
};
