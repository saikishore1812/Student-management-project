    import { Request, Response } from "express";
    import fs from "fs";
    import path from "path";

    const filePath = path.join(__dirname, "../data/students.json");

    // Helper to read/write JSON
    const readData = () => JSON.parse(fs.readFileSync(filePath, "utf8"));
    const writeData = (data: any) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    export const getStudents = (req: Request, res: Response) => {
    const students = readData();
    res.json(students);
    };

    export const addStudent = (req: Request, res: Response) => {
    const students = readData();
    const newStudent = {
        id: Date.now(),
        ...req.body
    };
    students.push(newStudent);
    writeData(students);
    res.json(newStudent);
    };

    export const updateStudent = (req: Request, res: Response) => {
    const students = readData();
    const id = Number(req.params.id);

    const updatedStudents = students.map((s: any) =>
        s.id === id ? { ...s, ...req.body } : s
    );

    writeData(updatedStudents);
    res.json(updatedStudents.find((s: any) => s.id === id));
    };

    export const deleteStudent = (req: Request, res: Response) => {
    const students = readData();
    const id = Number(req.params.id);

    const filtered = students.filter((s: any) => s.id !== id);
    writeData(filtered);

    res.json({ success: true });
    };
