import React, { useState ,useRef} from "react";

import axios from "axios";
import "../styles/StudentCodesByDate.css";

function StudentCodesByDate() {
  const [date, setDate] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const passwordInputRef = useRef(null);
  const handlePasswordSubmit = () => {
    if (password === "135246") {
      setIsAuthorized(true);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      alert("❌ Incorrect Password. Try Again.");
    }
  };
  const fetchStudents = async () => {
    if (!date) {
      alert("Please select a date");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/studentCodes/by-date?date=${date}`
      );
      setStudents(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      setStudents([]);
    }
    setLoading(false);
  };
  if (!isAuthorized) {
    return (
      <div className="Setcontainer">
        <h2>👁️FOR OFFICE USE ONLY</h2>
        <input
          ref={passwordInputRef}
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="passwordbttn" onClick={handlePasswordSubmit}>
          Submit
        </button>
      </div>
    );
  }
  return (
    <div className="student-codes-container">
      <h2>Fetch Student Codes By Date</h2>
      <div className="input-group">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="date-input"
        />
        <button onClick={fetchStudents} className="fetch-button">
          Fetch Codes
        </button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}
      {error && <p className="error-text">{error}</p>}

      {students.length > 0 ? (
        <table className="students-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Father's Name</th>
              <th>Batch</th>
              <th>Student Code</th>
              <th>Test Date</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.fatherName}</td>
                <td>{s.batch}</td>
                <td>{s.studentCode}</td>
                <td>{s.testDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p className="no-records">No records found</p>
      )}
    </div>
  );
}

export default StudentCodesByDate;
