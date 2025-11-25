import express from "express";
import {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
} from "../controllers/studentController"
import { signup, login } from "../controllers/authController";


const router = express.Router();

router.get("/", getStudents);
router.post("/", addStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

router.post("/auth/signup", signup);
router.post("/auth/login", login);

export default router;
