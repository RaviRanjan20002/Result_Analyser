import React, { useState } from "react";
import axios from "axios";
import "../styles/BatchResults.css";

const BatchResults = () => {
  const [batch, setBatch] = useState("");
  const [testType, setTestType] = useState("");
  const [testDate, setTestDate] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const fetchBatchResults = async () => {
    if (!batch || !testType || !testDate) {
      setError("Please select batch, test type and test date.");
      return;
    }

    setError("");

    try {
      const response = await axios.get(
        `http://localhost:3001/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
      );
      setResults(response.data);
    } catch (err) {
      setResults([]);
      if (err.response && err.response.status === 404) {
        setError(err.response.data.message || "No results found.");
      } else {
        setError("Something went wrong while fetching data.");
      }
    }
  };

  const isNeetBatch = testType.toLowerCase() === "neet";
  const subjectName = isNeetBatch ? "Biology" : "Mathematics";

  return (
    <div className="batch-results-container">
      <h2>Search Batch Results</h2>

      <div className="filters">
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

        <select className="test-type-select" onChange={(e) => setTestType(e.target.value)} value={testType}>
          <option value="">Select Test Type</option>
          <option value="jeemains">JEE Mains</option>
          <option value="jeeadvanced">JEE Advanced</option>
          <option value="neet">NEET</option>
          <option value="topictest">Topic Test</option>
          <option value="quiztest">Quiz Test</option>
        </select>

        <input
          type="date"
          className="date-input"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
        />

        <button className="search-button" onClick={fetchBatchResults}>Search</button>
      </div>

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
              <th>{subjectName} (Correct)</th>
              <th>{subjectName} (Incorrect)</th>
              <th>{subjectName} (Total)</th>
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

                {isNeetBatch ? (
                  <>
                    <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
                    <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
                  </>
                ) : (
                  <>
                    <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
                  </>
                )}
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

export default BatchResults;


