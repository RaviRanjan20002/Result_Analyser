import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/SetDetails.css";

const SetDetails = () => {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const passwordInputRef = useRef(null);

  const [formData, setFormData] = useState({
    testDate: "",
    studentCode: "",
    testType: "jeemains",
    subjectMarks: {
      physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
      chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
      biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
      mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
    },
    totalMarks: 0,
  });

  const [studentInfo, setStudentInfo] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchStudentByCode = async (code) => {
    if (!code || code.length !== 5) return;
    setLoading(true);
    try {
      const res = await axios.get(`https://result-analyserr.onrender.com/api/studentByCode/${code}`);
      if (res.data) {
        setStudentInfo(res.data);
      } else {
        alert("❌ Failed to fetch student.");
        setStudentInfo(null);
      }
    } catch (err) {
      setStudentInfo(null);
      alert("⚠️ Student not found for this Student code.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (formData.studentCode && formData.testDate && formData.testType) {
      fetchStudentByCode(formData.studentCode);
    }
    
  }, [formData.studentCode, formData.testDate, formData.testType]);

  const handleSubjectChange = (subject, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      subjectMarks: {
        ...prevData.subjectMarks,
        [subject]: {
          ...prevData.subjectMarks[subject],
          [field]: Number(value) || 0,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentInfo) {
      alert("⚠️ Student details not found for this code.");
      return;
    }
    const totalMarks =
      formData.subjectMarks.physics.totalMark +
      formData.subjectMarks.chemistry.totalMark +
      (studentInfo?.batch === "Z"
        ? formData.subjectMarks.mathematics.totalMark + formData.subjectMarks.biology.totalMark
        : formData.testType === "neet" || ["Dron", "Madhav", "Nakul"].includes(studentInfo?.batch)
        ? formData.subjectMarks.biology.totalMark
        : formData.subjectMarks.mathematics.totalMark);

    const payload = {
      studentCode: formData.studentCode,
      testType: formData.testType,
      testDate: formData.testDate,
      name: studentInfo.name,
      fatherName: studentInfo.fatherName,
      batch: studentInfo.batch,
      subjectMarks: formData.subjectMarks,
      totalMarks,
    };

    try {
      await axios.post("https://result-analyserr.onrender.com/api/results", payload);
      alert("✅ Result Saved Successfully!");
      setFormData({
        testDate: "",
        studentCode: "",
        testType: "jeemains",
        subjectMarks: {
          physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
          chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
          biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
          mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
        },
        totalMarks: 0,
      });
      setStudentInfo(null);
    } catch (err) {
      if (err.response?.status === 409) {
        alert("⚠️ Result already exists for this student, test type, and date.");
      } else {
        alert("❌ Something went wrong while saving.");
      }
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
    <div className="setdetails-bg">
      <div className="setdetails-card">
        <h2 className="title">📖 Enter Student Result by Code</h2>
        <form
          id="student-form"
          onSubmit={handleSubmit}
              onKeyDown={(e) => {
          if (e.key === "Enter") {
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);

            // Move to next input if available
            if (index > -1 && index + 1 < form.elements.length) {
              e.preventDefault();
              form.elements[index + 1].focus();
            }
          }
        }}
        >
          <div className="flex-row">
            <div className="form-group">
              <label>Date of Test</label>
              <input
                type="date"
                name="testDate"
                className="inputcl"
                value={formData.testDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Student Code</label>
              <input
                type="text"
                name="studentCode"
                className="inputcl"
                placeholder="5-digit Code"
                value={formData.studentCode}
                onChange={handleChange}
                maxLength={5}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label>Test Type</label>
              <select
                name="testType"
                className="selectcl"
                onChange={handleChange}
                value={formData.testType}
              >
                <option value="jeemains">JEE Mains</option>
                <option value="jeeadvanced">JEE Advanced</option>
                <option value="neet">NEET</option>
                <option value="topictest">Topic Test</option>
                <option value="quiztest">Quiz Test</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {loading && (
            <p className="info-msg">Loading student details...</p>
          )}

          {studentInfo && (
            <div className="student-info-card bounce-in">
              <div>
                <span className="icon user">&#128100;</span>
                <b>{studentInfo.name}</b>
              </div>
              <div>
                <span className="icon">&#128106;</span>
                {studentInfo.fatherName}
              </div>
              <div>
                <span className="icon">&#127891;</span>
                Batch: <b>{studentInfo.batch}</b>
              </div>
            </div>
          )}

          <div className="subject-section">
            {["physics", "chemistry"].map((subject) => (
              <div className="subject-card" key={subject}>
                <div className="subject-title">{subject.toUpperCase()}</div>
                {["correctMark", "incorrectMark", "totalMark"].map((type, idx) => (
                  <input
                    key={type}
                    type="number"
                    placeholder={
                      type === "correctMark"
                        ? "Correct"
                        : type === "incorrectMark"
                        ? "Incorrect"
                        : "Total"
                    }
                    className={`marks-input ${idx === 2 ? "totalmark" : ""}`}
                    value={formData.subjectMarks[subject][type]}
                    onChange={(e) => handleSubjectChange(subject, type, e.target.value)}
                    min={0}
                    required
                  />
                ))}
              </div>
            ))}

            {studentInfo?.batch === "Z" &&
              ["mathematics", "biology"].map((subject) => (
                <div className="subject-card" key={subject}>
                  <div className="subject-title">{subject.toUpperCase()}</div>
                  {["correctMark", "incorrectMark", "totalMark"].map((type, idx) => (
                    <input
                      key={type}
                      type="number"
                      placeholder={
                        type === "correctMark"
                          ? "Correct"
                          : type === "incorrectMark"
                          ? "Incorrect"
                          : "Total"
                      }
                      className={`marks-input ${idx === 2 ? "totalmark" : ""}`}
                      value={formData.subjectMarks[subject][type]}
                      onChange={(e) => handleSubjectChange(subject, type, e.target.value)}
                      min={0}
                      required
                    />
                  ))}
                </div>
              ))}

            {studentInfo?.batch !== "Z" && (
              <div className="subject-card">
                <div className="subject-title">
                  {formData.testType === "neet" ||
                  ["Dron", "Madhav", "Nakul"].includes(studentInfo?.batch)
                    ? "BIOLOGY"
                    : "MATHEMATICS"}
                </div>
                {(
                  ["Dron", "Madhav", "Nakul"].includes(studentInfo?.batch) ||
                  formData.testType === "neet"
                ) ? (
                  ["correctMark", "incorrectMark", "totalMark"].map((type, idx) => (
                    <input
                      key={type}
                      type="number"
                      placeholder={
                        type === "correctMark"
                          ? "Correct"
                          : type === "incorrectMark"
                          ? "Incorrect"
                          : "Total"
                      }
                      className={`marks-input ${idx === 2 ? "totalmark" : ""}`}
                      value={formData.subjectMarks.biology[type]}
                      onChange={(e) =>
                        handleSubjectChange("biology", type, e.target.value)
                      }
                      min={0}
                      required
                    />
                  ))
                ) : (
                  ["correctMark", "incorrectMark", "totalMark"].map((type, idx) => (
                    <input
                      key={type}
                      type="number"
                      placeholder={
                        type === "correctMark"
                          ? "Correct"
                          : type === "incorrectMark"
                          ? "Incorrect"
                          : "Total"
                      }
                      className={`marks-input ${idx === 2 ? "totalmark" : ""}`}
                      value={formData.subjectMarks.mathematics[type]}
                      onChange={(e) =>
                        handleSubjectChange("mathematics", type, e.target.value)
                      }
                      min={0}
                      required
                    />
                  ))
                )}
              </div>
            )}
          </div>
          <button type="submit" className="primary-btn wide-btn">
            💾 Save Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetDetails;
