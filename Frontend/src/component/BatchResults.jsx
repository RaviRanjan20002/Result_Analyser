import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/BatchResults.css";
import { useNavigate } from "react-router-dom";

const BatchResults = () => {
  const [batch, setBatch] = useState("");
  const [testType, setTestType] = useState("");
  const [testDate, setTestDate] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const navigate = useNavigate();

  const passwordInputRef = useRef(null);

  const handlePasswordSubmit = () => {
    if (password === "135246") {
      setIsAuthorized(true);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      alert("❌ Incorrect Password. Try Again.");
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await axios.get(
        "https://result-analyserr.onrender.com/api/batches"
      );
      setBatches(response.data);
    } catch (error) {
      console.error("Error fetching batches:", error);
    }
  };

  const fetchBatchResults = async () => {
    if (!batch || !testType || !testDate) {
      setError("Please select batch, test type and test date.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
      );

      // Sort by totalMarks descending
      const sorted = response.data.sort(
        (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
      );
      setResults(sorted);
    } catch (err) {
      setResults([]);
      if (err.response && err.response.status === 404) {
        setError(err.response.data.message || "No results found.");
      } else {
        setError("Something went wrong while fetching data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Determine subject display rules
  const isNeetBatch =
    results.length > 0 &&
    ["neet", "neettough", "neetmoderate"].includes(
      results[0]?.testType?.toLowerCase()
    );

  const isZBatchOther =
    results.length > 0 &&
    results[0]?.batch?.toLowerCase() === "z" &&
    results[0]?.testType?.toLowerCase() === "other";

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
    <div className="batch-results-container">
      <div className="header-container">
        <h1 className="header-title">Search Batch Results</h1>
      </div>

      <div className="filters-container">
        {/* Batch Dropdown */}
        <div className="filter-item">
          <select
            className="filter-select"
            name="batch"
            onChange={(e) => setBatch(e.target.value)}
            value={batch}
          >
            <option value="">Select Batch</option>
            {batches.map((b) => (
              <option key={b._id} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        </div>

        {/* Test Type Dropdown */}
        <div className="filter-item">
          <select
            className="filter-select"
            onChange={(e) => setTestType(e.target.value)}
            value={testType}
          >
            <option value="">Select Test Type</option>
            <option value="jeemains">JEE Mains</option>
            <option value="jeeadvanced">JEE Advanced</option>
            <option value="neet">NEET</option>
            <option value="topictest">Topic Test</option>
            <option value="quiztest">Quiz Test</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Date Input */}
        <div className="filter-item">
          <input
            type="date"
            className="filter-input"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
          />
        </div>

        {/* Search Button */}
        <div className="filter-item">
          <button className="filter-button" onClick={fetchBatchResults}>
            Search
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}
      {loading && (
        <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
          Searching...
        </p>
      )}

      {results.length > 0 ? (
        <table className="results-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>Father's Name</th>
              <th>Student Code</th>
              <th>Batch</th>
              <th>Test Type</th>
              <th>Physics (Correct)</th>
              <th>Physics (Incorrect)</th>
              <th>Physics (Total)</th>
              <th>Chemistry (Correct)</th>
              <th>Chemistry (Incorrect)</th>
              <th>Chemistry (Total)</th>
              {isNeetBatch && (
                <>
                  <th>Biology (Correct)</th>
                  <th>Biology (Incorrect)</th>
                  <th>Biology (Total)</th>
                </>
              )}
              {isZBatchOther && (
                <>
                  <th>Mathematics (Correct)</th>
                  <th>Mathematics (Incorrect)</th>
                  <th>Mathematics (Total)</th>
                  <th>Biology (Correct)</th>
                  <th>Biology (Incorrect)</th>
                  <th>Biology (Total)</th>
                </>
              )}
              {!isNeetBatch && !isZBatchOther && (
                <>
                  <th>Mathematics (Correct)</th>
                  <th>Mathematics (Incorrect)</th>
                  <th>Mathematics (Total)</th>
                </>
              )}
              <th>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {(() => {
              let rankMap = {};
              let rankCounter = 1;

              results.forEach((r) => {
                if (!(r.totalMarks in rankMap)) {
                  rankMap[r.totalMarks] = rankCounter++;
                }
              });

              return results.map((result, index) => {
                const rank = rankMap[result.totalMarks];

                return (
                  <tr key={index}>
                    <td>
                      {rank === 1
                        ? "🥇"
                        : rank === 2
                        ? "🥈"
                        : rank === 3
                        ? "🥉"
                        : rank}
                    </td>
                    <td>{result.name}</td>
                    <td>{result.fatherName}</td>
                    <td className="code-cell">{result.studentCode}</td>
                    <td>{result.batch}</td>
                    <td>{result.testType}</td>
                    <td>{result.subjectMarks?.physics?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.physics?.incorrectMark ?? "-"}</td>
                    <td>{result.subjectMarks?.physics?.totalMark ?? "-"}</td>
                    <td>{result.subjectMarks?.chemistry?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.chemistry?.incorrectMark ?? "-"}</td>
                    <td>{result.subjectMarks?.chemistry?.totalMark ?? "-"}</td>

                    {isNeetBatch && (
                      <>
                        <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
                        <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
                        <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
                      </>
                    )}

                    {isZBatchOther && (
                      <>
                        <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
                        <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
                        <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
                        <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
                        <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
                        <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
                      </>
                    )}

                    {!isNeetBatch && !isZBatchOther && (
                      <>
                        <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
                        <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
                        <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
                      </>
                    )}

                    <td className="marks-cell">{result.totalMarks ?? "-"}</td>
                  </tr>
                );
              });
            })()}
          </tbody>
        </table>
      ) : (
        <p className="ptag">No results found.</p>
      )}
    </div>
  );
};

export default BatchResults;

