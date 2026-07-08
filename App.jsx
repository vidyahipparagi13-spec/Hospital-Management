import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:5000";

export default function App() {
  const [patients, setPatients] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    disease: "",
    doctor: "",
  });

  const loadPatients = async () => {
    const res = await fetch(`${API}/patients`);
    const data = await res.json();
    setPatients(data);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addPatient = async (e) => {
    e.preventDefault();

    await fetch(`${API}/patients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      name: "",
      age: "",
      gender: "",
      disease: "",
      doctor: "",
    });

    loadPatients();
  };

  const deletePatient = async (id) => {
    await fetch(`${API}/patients/${id}`, {
      method: "DELETE",
    });

    loadPatients();
  };

  return (
    <div className="container">
      <h1>🏥 Hospital Management System</h1>

      <form className="form" onSubmit={addPatient}>
        <input
          type="text"
          name="name"
          placeholder="Patient Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <input
          type="text"
          name="disease"
          placeholder="Disease"
          value={form.disease}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="doctor"
          placeholder="Doctor"
          value={form.doctor}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Patient</button>
      </form>

      <h2>Patient List</h2>

      <div className="cards">
        {patients.map((p) => (
          <div className="card" key={p.id}>
            <h3>{p.name}</h3>

            <p>
              <b>Age:</b> {p.age}
            </p>

            <p>
              <b>Gender:</b> {p.gender}
            </p>

            <p>
              <b>Disease:</b> {p.disease}
            </p>

            <p>
              <b>Doctor:</b> {p.doctor}
            </p>

            <button
              className="delete"
              onClick={() => deletePatient(p.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}