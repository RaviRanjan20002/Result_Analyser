import React, { useState } from "react";
import axios from "axios";
import "../styles/GetDetails.css"; // Your custom CSS

const GetDetails = () => {
  const [studentCode, setStudentCode] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const fetchResults = async () => {
    if (!studentCode) {
      setError("Please enter the 5-digit student code.");
      return;
    }

    setError("");
    try {
      const response = await axios.get(
        `http://localhost:3001/api/resultbycode?studentCode=${studentCode}`
      );
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setResults([]);
      setError("No results found for this student code.");
    }
  };

  const isNeetBatch =
    results.length > 0 && results[0]?.batch?.toLowerCase() === "madhav";
  const subjectName = isNeetBatch ? "Biology" : "Mathematics";

  return (
    <div className="get-details-container">
      <h2>Search Student Results by Code</h2>

      <input
        type="text"
        placeholder="Enter 5-digit Student Code"
        value={studentCode}
        onChange={(e) => setStudentCode(e.target.value)}
        className="input-field"
      />

      <button onClick={fetchResults} className="search-button">
        Search
      </button>

      {error && <p className="error-message">{error}</p>}
     {results.length > 0 && (
        <div className="student-info">
          <h3>Student Information</h3>
          <p>Name: {results[0].name}</p>
          <p>Father's Name: {results[0].fatherName}</p>
        </div>
      )}
      {results.length > 0 ? (
        <table className="results-table">
          <thead>
            <tr>
              <th>Test Date</th>
              <th>Name</th>
              <th>Father's Name</th>
              <th>Batch</th>
              <th>Test Type</th>
              <th>Physics (Correct Marks)</th>
              <th>Physics (Incorrect Marks)</th>
              <th>Physics (Total Marks)</th>
              <th>Chemistry (Correct Marks)</th>
              <th>Chemistry (Incorrect Marks)</th>
              <th>Chemistry (Total Marks)</th>
              <th>{subjectName} (Correct Marks)</th>
              <th>{subjectName} (Incorrect Marks)</th>
              <th>{subjectName} (Total Marks)</th>
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

export default GetDetails;

