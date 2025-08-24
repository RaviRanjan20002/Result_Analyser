// import React, { useState } from "react";
// import axios from "axios";
// import "../styles/GetDetails.css"; // Your custom CSS

// const GetDetails = () => {
//   const [studentCode, setStudentCode] = useState("");
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const fetchResults = async () => {
//     if (!studentCode) {
//       setError("Please enter the 5-digit student code.");
//       return;
//     }
//     setError("");
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `https://result-analyserr.onrender.com/api/resultbycode?studentCode=${studentCode}`
//       );
//       setResults(response.data);
//     } catch (err) {
//       console.error(err);
//       setResults([]);
//       setError("No results found for this student code.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Batch checks
//   const isNeetBatch =
//     results.length > 0 &&
//     ["dron", "madhav", "nakul"].includes(results[0]?.batch?.toLowerCase());

//   const isZBatch =
//     results.length > 0 && results[0]?.batch?.toLowerCase() === "z";

//   return (
//     <div className="get-details-container">
//       <div className="box">Search Your Result By Enter Code</div>
//       <input
//         type="text"
//         placeholder="Enter 5-digit Student Code"
//         value={studentCode}
//         onChange={(e) => setStudentCode(e.target.value)}
//         className="input-field"
//       />

//       <button onClick={fetchResults} className="getbttn">
//         Search
//       </button>

//       {error && <p className="error-message">{error}</p>}

//       {loading && (
//         <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
//           Searching...
//         </p>
//       )}

//       {!loading && results.length > 0 && (
//         <div className="student-info">
//           <h3>Student Information</h3>
//           <p>Name: {results[0].name}</p>
//           <p>Father's Name: {results[0].fatherName}</p>
//         </div>
//       )}

//       {results.length > 0 ? (
//         <table className="results-table">
//           <thead>
//             <tr>
//               <th>Test Date</th>
//               <th>Name</th>
//               <th>Father's Name</th>
//               <th>Batch</th>
//               <th>Test Type</th>
//               <th>Physics (Correct Marks)</th>
//               <th>Physics (Incorrect Marks)</th>
//               <th>Physics (Total Marks)</th>
//               <th>Chemistry (Correct Marks)</th>
//               <th>Chemistry (Incorrect Marks)</th>
//               <th>Chemistry (Total Marks)</th>

//               {isNeetBatch && !isZBatch && (
//                 <>
//                   <th>Biology (Correct Marks)</th>
//                   <th>Biology (Incorrect Marks)</th>
//                   <th>Biology (Total Marks)</th>
//                 </>
//               )}

//               {!isNeetBatch && !isZBatch && (
//                 <>
//                   <th>Mathematics (Correct Marks)</th>
//                   <th>Mathematics (Incorrect Marks)</th>
//                   <th>Mathematics (Total Marks)</th>
//                 </>
//               )}

//               {isZBatch && (
//                 <>
//                   <th>Biology (Correct Marks)</th>
//                   <th>Biology (Incorrect Marks)</th>
//                   <th>Biology (Total Marks)</th>
//                   <th>Mathematics (Correct Marks)</th>
//                   <th>Mathematics (Incorrect Marks)</th>
//                   <th>Mathematics (Total Marks)</th>
//                 </>
//               )}

//               <th>Total Marks</th>
//               <th>Rank</th>
//             </tr>
//           </thead>
//           <tbody>
//             {results.map((result, index) => (
//               <tr key={index}>
//                 <td>{result.testDate}</td>
//                 <td>{result.name}</td>
//                 <td>{result.fatherName}</td>
//                 <td>{result.batch}</td>
//                 <td>{result.testType}</td>
//                 <td>{result.subjectMarks?.physics?.correctMark ?? "-"}</td>
//                 <td>{result.subjectMarks?.physics?.incorrectMark ?? "-"}</td>
//                 <td>{result.subjectMarks?.physics?.totalMark ?? "-"}</td>
//                 <td>{result.subjectMarks?.chemistry?.correctMark ?? "-"}</td>
//                 <td>{result.subjectMarks?.chemistry?.incorrectMark ?? "-"}</td>
//                 <td>{result.subjectMarks?.chemistry?.totalMark ?? "-"}</td>

//                 {isNeetBatch && !isZBatch && (
//                   <>
//                     <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
//                   </>
//                 )}

//                 {!isNeetBatch && !isZBatch && (
//                   <>
//                     <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
//                   </>
//                 )}

//                 {isZBatch && (
//                   <>
//                     <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
//                   </>
//                 )}

//                 <td>{result.totalMarks ?? "-"}</td>
//                 <td>{result.rank}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         !loading && <p>No results found.</p>
//       )}
//     </div>
//   );
// };

// export default GetDetails;



import React, { useState } from "react";
import { FaGreaterThan } from "react-icons/fa6";
import axios from "axios";
import "../styles/GetDetails.css";
import Teachers from "../assets/Teachers.png"; // Adjust the path as needed
import trophy from "../assets/trophy.png"; // Adjust the path as needed
const GetDetails = () => {
  const [studentCode, setStudentCode] = useState("");
  const [step, setStep] = useState(1); // 1 = enter code, 2 = select test, 3 = view result
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔹 Step 1: Fetch all tests for student
  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!studentCode) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/resultbycode?studentCode=${studentCode}`
      );

      if (res.data.length === 0) {
        setError("No results found for this student code.");
        setTests([]);
        return;
      }

      // store list of tests
      setTests(res.data);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Something went wrong fetching results.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2: Select a test and show result
  const handleViewResult = (test) => {
    setSelectedTest(test);
    setStep(3);
  };

  return (
    <div className="viewresult-bg">
      <div className="viewresult-container">
        {/* STEP 1: Enter Student Code */}
{step === 1 && (
  <div className="step1-container">
    <div className="viewresult-card">
      <div className="viewresult-header">Enter Student Code To View Result</div>

      <form onSubmit={handleCodeSubmit} className="viewresult-form">
        <label className="form-label">Student Code</label>
        <input
          type="text"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
          placeholder="Enter Code"
          required
        />
        <div className="form-note">
          {/* Note: Enter the 5-digit student code to view results. */}
          <button type="submit">
          <span className="button-text"> {loading ? "Searching..." : "View Result"} </span>
          <span><FaGreaterThan className="arrow" /></span> 
        </button>
        </div>
        
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>

    {/* put image INSIDE container */}
    <div className="teachers-img-container">
      <img className="teachers-img" src={Teachers} alt="Teachers" />
    </div>
  </div>
)}




        {/* STEP 2: Select Test */}
        {step === 2 && (
  <div className="step2-container">
    <div className="step2-card">
      <div className="step2-header">Select Test To View Result</div>

      <table className="step2-table">  
        <thead>
          <tr>
            <th>Test Date</th>
            <th>Test Pattern</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t, idx) => (
            <tr key={idx}>
              <td>{t.testDate}</td>
              <td>{t.testType}</td>
              <td>
                <button
                  className="step2-btn"
                  onClick={() => handleViewResult(t)}
                >
                  View Result <span className="arrow">➜</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


        {/* STEP 3: Show Result */}
{step === 3 && selectedTest && (
  <div className="step3-container">
    {/* Left: Result Card */}
    <div className="step3-card">
      <div className="step3-header">STUDENT RESULT PORTAL
           <button
          className="back-btn"
          onClick={() => {
            setStep(2);       // go back to step 2
            setSelectedTest(null); // clear current test
          }}
        >
          ⬅ Back
        </button>
      </div>

      {/* Student Info */}
      <div className="step3-info">
        <div>
          <div className="label">Test Date</div>
          <div className="getinfo-box">{selectedTest.testDate}</div>
        </div>
        <div>
          <div className="label">Student Code</div>
          <div className="getinfo-box">{selectedTest.studentCode}</div>
        </div>
        <div>
          <div className="label">Test Pattern</div>
          <div className="getinfo-box">{selectedTest.testType}</div>
        </div>
        <div>
          <div className="label">Name</div>
          <div className="getinfo-box">{selectedTest.name}</div>
        </div>
        <div>
          <div className="label">Father's Name</div>
          <div className="getinfo-box">{selectedTest.fatherName}</div>
        </div>
        <div>
          <div className="label">Batch</div>
          <div className="getinfo-box">{selectedTest.batch}</div>
        </div>

        <div className="rank-box">
          Rank : <span>{selectedTest.rank}</span>
        </div>
      </div>

      {/* Marks Table */}
{/* Marks Table */}
<table className="step3-table">
  <thead>
    <tr>
      <th>Subject</th>
      {Object.values(selectedTest.subjectMarks || {}).some(
        (m) => m?.obtainedMark !== undefined && m?.obtainedMark !== null
      ) ? (
        <>
          <th>Total Marks</th>
          <th>Positive Marks</th>
          <th>Negative Marks</th>
          <th>Obtained Marks</th>
        </>
      ) : (
        <>
          <th>Positive Marks</th>
          <th>Negative Marks</th>
          <th>Obtained Marks</th>
        </>
      )}
    </tr>
  </thead>

  <tbody>
    {selectedTest.subjectMarks &&
      Object.entries(selectedTest.subjectMarks).map(([sub, marks]) => {
        const hasObtained =
          marks?.obtainedMark !== undefined && marks?.obtainedMark !== null;

        return (
          <tr key={sub}>
            <td
              style={{
                color: "black",
                fontWeight: "bolder",
                textTransform: "capitalize",
                fontSize: "18px",
              }}
            >
              {sub}
            </td>

            {hasObtained ? (
              <>
                <td>
                  <div className="cell-box">{marks.totalMark ?? "-"}</div>
                </td>
                <td>
                  <div className="cell-box">{marks.correctMark ?? "-"}</div>
                </td>
                <td>
                  <div className="cell-box">{marks.incorrectMark ?? "-"}</div>
                </td>
                <td>
                  <div className="cell-box">{marks.obtainedMark ?? "-"}</div>
                </td>
              </>
            ) : (
              <>
                <td>
                  <div className="cell-box">{marks.correctMark ?? "-"}</div>
                </td>
                <td>
                  <div className="cell-box">{marks.incorrectMark ?? "-"}</div>
                </td>
                <td>
                  <div className="cell-box">{marks.totalMark ?? "-"}</div>
                </td>
              </>
            )}
          </tr>
        );
      })}
  </tbody>
</table>

      {/* Summary */}
      <div className="step3-summary">
        {selectedTest.maxMarks &&  <div className="getinfo-box btext ">Maximum Marks : <b> {selectedTest.maxMarks ?? "-"}</b></div>}
        <div className="getinfo-box btext ">Obtained Marks : <b>{selectedTest.totalMarks ?? "-"}</b></div>
      </div>
    </div>

    {/* Right: Trophy Section */}
<div className="step3-trophy">


  {/* Gold - Rank 1 */}
<div className="trophy-wrapper">
  <img src={trophy} alt="Trophy" className="trophy-image" />

  <div className="trophy-names">
    <div className="name silver">{selectedTest.top3?.[1]?.name ?? "-"}</div>
    <div className="name gold">{selectedTest.top3?.[0]?.name ?? "-"}</div>
    <div className="name bronze">{selectedTest.top3?.[2]?.name ?? "-"}</div>
  </div>
</div>


  {/* Bronze - Rank 3 */}
  {/* <div className="trophy bronze">
    <img src={trophy} alt="Bronze" />
    <div className="trophy-name">{selectedTest.top3?.[2]?.name ?? "-"}</div>
  </div> */}
</div>

  </div>
)}



      </div>

    </div>
  );
};

export default GetDetails;



