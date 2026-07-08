const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const db = new Database("hospital.db");

// Create Tables
db.exec(`
CREATE TABLE IF NOT EXISTS patients(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    disease TEXT,
    doctor TEXT
);

CREATE TABLE IF NOT EXISTS doctors(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    specialization TEXT,
    experience INTEGER
);
`);

// ---------------------- PATIENT API ----------------------

// Get all patients
app.get("/patients", (req, res) => {
    const patients = db.prepare("SELECT * FROM patients").all();
    res.json(patients);
});

// Get patient by id
app.get("/patients/:id", (req, res) => {
    const patient = db.prepare("SELECT * FROM patients WHERE id=?").get(req.params.id);

    if (!patient)
        return res.status(404).json({ message: "Patient not found" });

    res.json(patient);
});

// Add patient
app.post("/patients", (req, res) => {
    const { name, age, gender, disease, doctor } = req.body;

    const result = db.prepare(`
    INSERT INTO patients(name,age,gender,disease,doctor)
    VALUES(?,?,?,?,?)
    `).run(name, age, gender, disease, doctor);

    res.json({
        message: "Patient Added",
        id: result.lastInsertRowid
    });
});

// Update patient
app.put("/patients/:id", (req, res) => {

    const { name, age, gender, disease, doctor } = req.body;

    const result = db.prepare(`
    UPDATE patients
    SET name=?, age=?, gender=?, disease=?, doctor=?
    WHERE id=?
    `).run(name, age, gender, disease, doctor, req.params.id);

    if (result.changes === 0)
        return res.status(404).json({ message: "Patient not found" });

    res.json({ message: "Patient Updated" });
});

// Delete patient
app.delete("/patients/:id", (req, res) => {

    const result = db.prepare("DELETE FROM patients WHERE id=?").run(req.params.id);

    if (result.changes === 0)
        return res.status(404).json({ message: "Patient not found" });

    res.json({ message: "Patient Deleted" });

});

// ---------------------- DOCTOR API ----------------------

// Get doctors
app.get("/doctors", (req, res) => {
    const doctors = db.prepare("SELECT * FROM doctors").all();
    res.json(doctors);
});

// Get doctor
app.get("/doctors/:id", (req, res) => {

    const doctor = db.prepare("SELECT * FROM doctors WHERE id=?").get(req.params.id);

    if (!doctor)
        return res.status(404).json({ message: "Doctor not found" });

    res.json(doctor);

});

// Add doctor
app.post("/doctors", (req, res) => {

    const { name, specialization, experience } = req.body;

    const result = db.prepare(`
    INSERT INTO doctors(name,specialization,experience)
    VALUES(?,?,?)
    `).run(name, specialization, experience);

    res.json({
        message: "Doctor Added",
        id: result.lastInsertRowid
    });

});

// Update doctor
app.put("/doctors/:id", (req, res) => {

    const { name, specialization, experience } = req.body;

    const result = db.prepare(`
    UPDATE doctors
    SET name=?, specialization=?, experience=?
    WHERE id=?
    `).run(name, specialization, experience, req.params.id);

    if (result.changes === 0)
        return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor Updated" });

});

// Delete doctor
app.delete("/doctors/:id", (req, res) => {

    const result = db.prepare("DELETE FROM doctors WHERE id=?").run(req.params.id);

    if (result.changes === 0)
        return res.status(404).json({ message: "Doctor not found" });

    res.json({ message: "Doctor Deleted" });

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});