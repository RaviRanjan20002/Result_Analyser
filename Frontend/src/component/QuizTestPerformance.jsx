import React, { useState } from "react";
import axios from "axios";
import "../styles/BatchResults.css";

const QuizTestPerformance = () => {
  const [batch, setBatch] = useState("");
  const [filter, setFilter] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const fetchBatchResults = async () => {
    if (!batch || !maxMarks) {
      setError("Please select a batch and enter max marks.");
      return;
    }
    setError("");

    try {
      const response = await axios.get(`http://localhost:3001/api/quiz-performance/${batch}`, {
        params: {
          filter,
          maxMarks,
        },
      });
      setResults(response.data);
    } catch (err) {
      setResults([]);
      setError("No results found for this batch in Quiz Tests.");
    }
  };

  return (
    <div className="batch-results-container">
      <h2>Quiz Test Performance</h2>

      <select className="batch-select" onChange={(e) => setBatch(e.target.value)} value={batch}>
        <option value="">Select Batch</option>
        <option value="Arjun">Arjun</option>
        <option value="Eklavya">Eklavya</option>
        <option value="Bhism">Bhism</option>
        <option value="Bheem">Bheem</option>
        <option value="Madhav">Madhav</option>
        <option value="Dron">Dron</option>
        <option value="Nakul">Nakul</option>
        <option value="Toppers">Toppers</option>
      </select>

      <input
        type="number"
        placeholder="Enter Max Marks"
        value={maxMarks}
        onChange={(e) => setMaxMarks(e.target.value)}
        className="max-marks-input"
      />

      <select className="filter-select" onChange={(e) => setFilter(e.target.value)} value={filter}>
        <option value="">select the required Filter</option>
        <option value="above75">Above 75% (Single Test)</option>
        <option value="below75">Below 75% (Single Test)</option>
        <option value="above75Last3">Above 75% (Last 3 Consecutive Tests)</option>
        <option value="below75Last3">Below 75% (Last 3 Consecutive Tests)</option>
      </select>

      <button className="search-button" onClick={fetchBatchResults}>Search</button>

      {error && <p className="error-message">{error}</p>}

      {results.length > 0 ? (
        <table className="results-table">
          <thead>
            <tr>
              <th>Test Date</th>
              <th>Name</th>
              <th>Father's Name</th>
              <th>Batch</th>
              <th>Test Type</th>
              <th>Physics (Correct)</th>
              <th>Physics (Incorrect)</th>
              <th>Physics (Total)</th>
              <th>Chemistry (Correct)</th>
              <th>Chemistry (Incorrect)</th>
              <th>Chemistry (Total)</th>
              <th>Mathematics (Correct)</th>
              <th>Mathematics (Incorrect)</th>
              <th>Mathematics (Total)</th>
              <th>Total Marks</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td>{result.testDate}</td>
                <td>{result.name}</td>
                <td>{result.fatherName}</td>
                <td>{result.batch}</td>
                <td>{result.testType}</td>
                <td>{result.subjectMarks?.physics?.correctMark ?? "-"}</td>
                <td>{result.subjectMarks?.physics?.incorrectMark ?? "-"}</td>
                <td>{result.subjectMarks?.physics?.totalMark ?? "-"}</td>
                <td>{result.subjectMarks?.chemistry?.correctMark ?? "-"}</td>
                <td>{result.subjectMarks?.chemistry?.incorrectMark ?? "-"}</td>
                <td>{result.subjectMarks?.chemistry?.totalMark ?? "-"}</td>
                <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
                <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
                <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
                <td>{result.totalMarks ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
};

export default QuizTestPerformance;



