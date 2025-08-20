import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaArrowRight } from "react-icons/fa";
import "../styles/ViewStudentCodes.css";

const ViewStudentCodes = () => {
  const [batches, setBatches] = useState([]);
  const [selectedBatch, setSelectedBatch] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // success or error
  const [loading, setLoading] = useState(false);
  const [displayedBatch, setDisplayedBatch] = useState("");

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://result-analyserr.onrender.com/api/batches");
      const batchNames = response.data.map((b) =>
        typeof b === "string" ? b : b.batch || b.name || ""
      );
      setBatches([...new Set(batchNames.filter(Boolean))]);
    } catch (error) {
      console.error("Error fetching batches:", error);
      setMessage("⚠️ Failed to load batches.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

 const fetchStudentsByBatch = async () => {
  if (!selectedBatch) return alert("Please select a batch.");
  setLoading(true);
  try {
    const res = await axios.get(
      `http://result-analyserr.onrender.com/api/studentsByBatch/${selectedBatch}`
    );
    setStudents(res.data || []);
    setDisplayedBatch(selectedBatch);  // ✅ Set the batch used for display
    setMessage(`✅ Found ${res.data.length} students`);
    setMessageType("success");
  } catch (err) {
    console.error("Error fetching students", err);
    setMessage("❌ Something went wrong while fetching students.");
    setMessageType("error");
  } finally {
    setLoading(false);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  }
};


 const clearStudents = () => {
  setStudents([]);
  setSelectedBatch("");
  setDisplayedBatch("");
  setMessage("");
  setMessageType("");
};


  return (
    <div className="code-container">
      <h2>🔍 View Registered Students</h2>

      <div className="controls">
        <select
          className="batch-select"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        >
          <option value="">-- Select Batch --</option>
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>

        <button className="view-button" onClick={fetchStudentsByBatch} disabled={loading}>
          {loading ? "Loading..." : "View Codes"}
        </button>

        <button className="clear-button" onClick={clearStudents}>
          Clear
        </button>
      </div>

      {message && (
        <div className={`message ${messageType}`}>
          {message}
        </div>
      )}

      {loading && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {!loading && students.length > 0 && (
        <div className="results-box">
          <h3>Students in Batch: {displayedBatch}</h3>

          <div className="table-wrapper">
            <table className="student-table">      
            <caption>📋 Student Details</caption>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Father's Name</th>
                  <th>Student Code</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.studentCode}>
                    <td>{s.name}</td>
                    <td>{s.fatherName}</td>
                    <td>{s.studentCode}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStudentCodes;


