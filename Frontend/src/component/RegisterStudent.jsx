import React, { useState, useEffect,useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegisterStudent.css";

const RegisterStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    batch: "",
    testDate: "",
  });
  const [password, setPassword] = useState("");
    const [isAuthorized, setIsAuthorized] = useState(false);
    const passwordInputRef = useRef(null);

  const [studentCode, setStudentCode] = useState("");
  const [responseInfo, setResponseInfo] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);

  const navigate = useNavigate();

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
      setMessage("Failed to load batches");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
  const handlePasswordSubmit = () => {
    if (password === "135246") {
      setIsAuthorized(true);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      alert("❌ Incorrect Password. Try Again.");
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStudentCode("");
    setResponseInfo(null);
    setMessage("");
    setMessageType("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://result-analyserr.onrender.com/api/generate-code",
        formData
      );
      setStudentCode(res.data.studentCode);
      setResponseInfo(res.data);
      setMessage("✅ Student Code Generated Successfully!");
      setMessageType("success");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to generate code.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };
 if (!isAuthorized) {
    return (
      <div className="set-auth-bg">
        <form
          className="set-auth-card"
          onSubmit={(e) => {
            e.preventDefault();
            handlePasswordSubmit();
          }}
        >
          <h2>🔐 Admin Access</h2>
          <input
            ref={passwordInputRef}
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="inputcl"
          />
          <button className="primary-btn" type="submit">
            Login
          </button>
        </form>
      </div>
    );
  }
  return (
    <div className="register-container">
      <h2>🎓 Register Student</h2>

      {message && <div className={`message ${messageType}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          value={formData.fatherName}
          onChange={handleChange}
          required
        />
        <select
          name="batch"
          value={formData.batch}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Batch --</option>
          {batches.map((batch) => (
            <option key={batch} value={batch}>
              {batch}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="testDate"
          value={formData.testDate}
          onChange={handleChange}
          required
        />
        <button className="reg-btn" type="submit" disabled={loading}>
          {loading ? <span className="spinner"></span> : "Generate Student Code"}
        </button>
      </form>

      <button className="view-btn" onClick={() => navigate("/view-registered")}>
        📋 View Registered Students
      </button>

      {studentCode && (
        <div className="info-box">
          <h4>✅ Code Generated!</h4>
          <p>
            <strong>Name:</strong> {responseInfo.name}
          </p>
          <p>
            <strong>Father's Name:</strong> {responseInfo.fatherName}
          </p>
          <p>
            <strong>Batch:</strong> {responseInfo.batch}
          </p>
          <p>
            <strong>Date:</strong> {responseInfo.testDate}
          </p>
          <p>
            <strong>Student Code:</strong>{" "}
            <span style={{ color: "green" }}>{studentCode}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default RegisterStudent;

