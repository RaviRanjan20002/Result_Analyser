import React, { useState } from "react";
import axios from "axios";
import "../styles/GetDetails.css"; // Your custom CSS

const GetDetails = () => {
  const [studentCode, setStudentCode] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchResults = async () => {
    if (!studentCode) {
      setError("Please enter the 5-digit student code.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const response = await axios.get(
        `https://result-analyserr.onrender.com/api/resultbycode?studentCode=${studentCode}`
      );
      setResults(response.data);
    } catch (err) {
      console.error(err);
      setResults([]);
      setError("No results found for this student code.");
    } finally {
      setLoading(false);
    }
  };

  // Batch checks
  const isNeetBatch =
    results.length > 0 &&
    ["dron", "madhav", "nakul"].includes(results[0]?.batch?.toLowerCase());

  const isZBatch =
    results.length > 0 && results[0]?.batch?.toLowerCase() === "z";

  return (
    <div className="get-details-container">
      <div className="box">Search Your Result By Enter Code</div>
      <input
        type="text"
        placeholder="Enter 5-digit Student Code"
        value={studentCode}
        onChange={(e) => setStudentCode(e.target.value)}
        className="input-field"
      />

      <button onClick={fetchResults} className="getbttn">
        Search
      </button>

      {error && <p className="error-message">{error}</p>}

      {loading && (
        <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
          Searching...
        </p>
      )}

      {!loading && results.length > 0 && (
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

              {isNeetBatch && !isZBatch && (
                <>
                  <th>Biology (Correct Marks)</th>
                  <th>Biology (Incorrect Marks)</th>
                  <th>Biology (Total Marks)</th>
                </>
              )}

              {!isNeetBatch && !isZBatch && (
                <>
                  <th>Mathematics (Correct Marks)</th>
                  <th>Mathematics (Incorrect Marks)</th>
                  <th>Mathematics (Total Marks)</th>
                </>
              )}

              {isZBatch && (
                <>
                  <th>Biology (Correct Marks)</th>
                  <th>Biology (Incorrect Marks)</th>
                  <th>Biology (Total Marks)</th>
                  <th>Mathematics (Correct Marks)</th>
                  <th>Mathematics (Incorrect Marks)</th>
                  <th>Mathematics (Total Marks)</th>
                </>
              )}

              <th>Total Marks</th>
              <th>Rank</th>
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

                {isNeetBatch && !isZBatch && (
                  <>
                    <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
                    <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
                  </>
                )}

                {!isNeetBatch && !isZBatch && (
                  <>
                    <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
                  </>
                )}

                {isZBatch && (
                  <>
                    <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
                    <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
                  </>
                )}

                <td>{result.totalMarks ?? "-"}</td>
                <td>{result.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && <p>No results found.</p>
      )}
    </div>
  );
};

export default GetDetails;


