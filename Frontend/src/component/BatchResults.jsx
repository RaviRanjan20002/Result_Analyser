// import React, { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import "../styles/BatchResults.css";
// import { useNavigate } from "react-router-dom";

// const BatchResults = () => {
//   const [batch, setBatch] = useState("");
//   const [testType, setTestType] = useState("");
//   const [testDate, setTestDate] = useState("");
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const [password, setPassword] = useState("");
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const navigate = useNavigate();

//   const passwordInputRef = useRef(null);

//   const handlePasswordSubmit = () => {
//     if (password === "135246") {
//       setIsAuthorized(true);
//       setTimeout(() => passwordInputRef.current?.focus(), 100);
//     } else {
//       alert("❌ Incorrect Password. Try Again.");
//     }
//   };

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const fetchBatches = async () => {
//     try {
//       const response = await axios.get(
//         "https://result-analyserr.onrender.com/api/batches"
//       );
//       setBatches(response.data);
//     } catch (error) {
//       console.error("Error fetching batches:", error);
//     }
//   };

//   const fetchBatchResults = async () => {
//     if (!batch || !testType || !testDate) {
//       setError("Please select batch, test type and test date.");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const response = await axios.get(
//         `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
//       );

//       // Sort by totalMarks descending
//       const sorted = response.data.sort(
//         (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
//       );
//       setResults(sorted);
//     } catch (err) {
//       setResults([]);
//       if (err.response && err.response.status === 404) {
//         setError(err.response.data.message || "No results found.");
//       } else {
//         setError("Something went wrong while fetching data.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Determine subject display rules
//   const isNeetBatch =
//     results.length > 0 &&
//     ["neet", "neettough", "neetmoderate"].includes(
//       results[0]?.testType?.toLowerCase()
//     );

//   const isZBatchOther =
//     results.length > 0 &&
//     results[0]?.batch?.toLowerCase() === "z" &&
//     results[0]?.testType?.toLowerCase() === "other";

//    if (!isAuthorized) {
//     return (
//       <div className="set-auth-bg">
//         <form
//           className="set-auth-card"
//           onSubmit={(e) => {
//             e.preventDefault();
//             handlePasswordSubmit();
//           }}
//         >
//           <h2>🔐 Admin Access</h2>
//           <input
//             ref={passwordInputRef}
//             type="password"
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="inputcl"
//           />
//           <button className="primary-btn" type="submit">
//             Login
//           </button>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="batch-results-container">
//       <div className="header-container">
//         <h1 className="header-title">Search Batch Results</h1>
//       </div>

//       <div className="filters-container">
//         {/* Batch Dropdown */}
//         <div className="filter-item">
//           <select
//             className="filter-select"
//             name="batch"
//             onChange={(e) => setBatch(e.target.value)}
//             value={batch}
//           >
//             <option value="">Select Batch</option>
//             {batches.map((b) => (
//               <option key={b._id} value={b.name}>
//                 {b.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Test Type Dropdown */}
//         <div className="filter-item">
//           <select
//             className="filter-select"
//             onChange={(e) => setTestType(e.target.value)}
//             value={testType}
//           >
//                 <option value="jeemains">JEE Mains</option>
//                 <option value="jeemainsparttest">JEE Mains-Part Test</option>
//                 <option value="jeemainscumulativetest">JEE Mains-Cumulative Test</option>
//                 <option value="jeeadvanced">JEE Advanced</option>
//                 <option value="neet">NEET</option>
//                 <option value="neetparttest">NEET Part Test</option>
//                 <option value="neettough">NEET Tough</option>
//                 <option value="neetmoderate">NEET Moderate</option>
//                 <option value="topictest">Topic Test</option>
//                 <option value="quiztest">Quiz Test</option>
//                 <option value="other">Other</option>
//           </select>
//         </div>

//         {/* Date Input */}
//         <div className="filter-item">
//           <input
//             type="date"
//             className="filter-input"
//             value={testDate}
//             onChange={(e) => setTestDate(e.target.value)}
//           />
//         </div>

//         {/* Search Button */}
//         <div className="filter-item">
//           <button className="filter-button" onClick={fetchBatchResults}>
//             Search
//           </button>
//         </div>
      
//       </div>

//       {error && <p className="error-message">{error}</p>}
//       {loading && (
//         <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
//           Searching...
//         </p>
//       )}

//       {results.length > 0 ? (
//         <table className="results-table">
//           <thead>
//             <tr>
//               <th>Rank</th>
//               <th>Name</th>
//               <th>Father's Name</th>
//               <th>Student Code</th>
//               <th>Batch</th>
//               <th>Test Type</th>
//               <th>Physics (Correct)</th>
//               <th>Physics (Incorrect)</th>
//               <th>Physics (Total)</th>
//               <th>Chemistry (Correct)</th>
//               <th>Chemistry (Incorrect)</th>
//               <th>Chemistry (Total)</th>
//               {isNeetBatch && (
//                 <>
//                   <th>Biology (Correct)</th>
//                   <th>Biology (Incorrect)</th>
//                   <th>Biology (Total)</th>
//                 </>
//               )}
//               {isZBatchOther && (
//                 <>
//                   <th>Mathematics (Correct)</th>
//                   <th>Mathematics (Incorrect)</th>
//                   <th>Mathematics (Total)</th>
//                   <th>Biology (Correct)</th>
//                   <th>Biology (Incorrect)</th>
//                   <th>Biology (Total)</th>
//                 </>
//               )}
//               {!isNeetBatch && !isZBatchOther && (
//                 <>
//                   <th>Mathematics (Correct)</th>
//                   <th>Mathematics (Incorrect)</th>
//                   <th>Mathematics (Total)</th>
//                 </>
//               )}
//               <th>Total Marks</th>
//             </tr>
//           </thead>
//           <tbody>
//             {(() => {
//               let rankMap = {};
//               let rankCounter = 1;

//               results.forEach((r) => {
//                 if (!(r.totalMarks in rankMap)) {
//                   rankMap[r.totalMarks] = rankCounter++;
//                 }
//               });

//               return results.map((result, index) => {
//                 const rank = rankMap[result.totalMarks];

//                 return (
//                   <tr key={index}>
//                     <td>
//                       {rank === 1
//                         ? "🥇"
//                         : rank === 2
//                         ? "🥈"
//                         : rank === 3
//                         ? "🥉"
//                         : rank}
//                     </td>
//                     <td>{result.name}</td>
//                     <td>{result.fatherName}</td>
//                     <td className="code-cell">{result.studentCode}</td>
//                     <td>{result.batch}</td>
//                     <td>{result.testType}</td>
//                     <td>{result.subjectMarks?.physics?.correctMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.physics?.incorrectMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.physics?.totalMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.chemistry?.correctMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.chemistry?.incorrectMark ?? "-"}</td>
//                     <td>{result.subjectMarks?.chemistry?.totalMark ?? "-"}</td>

//                     {isNeetBatch && (
//                       <>
//                         <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
//                       </>
//                     )}

//                     {isZBatchOther && (
//                       <>
//                         <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
//                       </>
//                     )}

//                     {!isNeetBatch && !isZBatchOther && (
//                       <>
//                         <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
//                         <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
//                       </>
//                     )}

//                     <td className="marks-cell">{result.totalMarks ?? "-"}</td>
//                   </tr>
//                 );
//               });
//             })()}
//           </tbody>
//         </table>
//       ) : (
//         <p className="ptag">No results found.</p>
//       )}
//     </div>
//   );
// };

// export default BatchResults;


// updated working
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/BatchResults.css";
// import { FaGreaterThan } from "react-icons/fa6";

// const BatchResults = () => {
//   const [batch, setBatch] = useState("");
//   const [testType, setTestType] = useState("");
//   const [tests, setTests] = useState([]); // store available test dates
//   const [selectedTest, setSelectedTest] = useState(null);
//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [batches, setBatches] = useState([]);
//   const [step, setStep] = useState(1);

//   useEffect(() => {
//     fetchBatches();
//   }, []);

//   const fetchBatches = async () => {
//     try {
//       const res = await axios.get(
//         "https://result-analyserr.onrender.com/api/batches"
//       );
//       setBatches(res.data);
//     } catch (err) {
//       console.error("Error fetching batches", err);
//     }
//   };

//   // 🔹 Step 1 → fetch test dates for batch & testType
//   const handleBatchTypeSubmit = async (e) => {
//     e.preventDefault();
//     if (!batch || !testType) return;

//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `http://localhost:3001/api/testdates?batch=${batch}&testType=${testType}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No test dates found for this selection.");
//         setTests([]);
//         return;
//       }

//       setTests(res.data);
//       setStep(2);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching test dates.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Step 2 → fetch results for selected test
//   const handleViewResult = async (testDate) => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No results found for this test.");
//         setResults([]);
//         return;
//       }

//       // sort by marks
//       const sorted = res.data.sort(
//         (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
//       );

//       setResults(sorted);
//       setSelectedTest({ testDate });
//       setStep(3);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching results.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Subject display rules
//   const isNeetBatch =
//     results.length > 0 &&
//     ["neet", "neettough", "neetmoderate", "neetparttest"].includes(
//       results[0]?.testType?.toLowerCase()
//     );

//   const isZBatchOther =
//     results.length > 0 &&
//     results[0]?.batch?.toLowerCase() === "z" &&
//     results[0]?.testType?.toLowerCase() === "other";

//   return (
//     <div className="viewresult-bg">
//       <div className="viewresult-container">
//         {/* 🔹 STEP 1 */}
//         {step === 1 && (
//           <div className="step1-container">
//             <div className="viewresult-card">
//               <div className="viewresult-header">
//                 Select Batch & Test Type To View Results
//               </div>

//               <form onSubmit={handleBatchTypeSubmit} className="viewresult-form">
//                 <label className="form-label">Batch</label>
//                 <select
//                   value={batch}
//                   onChange={(e) => setBatch(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Batch</option>
//                   {batches.map((b) => (
//                     <option key={b._id} value={b.name}>
//                       {b.name}
//                     </option>
//                   ))}
//                 </select>

//                 <label className="form-label">Test Type</label>
//                 <select
//                   value={testType}
//                   onChange={(e) => setTestType(e.target.value)}
//                   required
//                 >
//                   <option value="">Select Test Type</option>
//                   <option value="jeemains">JEE Mains</option>
//                   <option value="jeemainsparttest">JEE Mains-Part Test</option>
//                   <option value="jeemainscumulativetest">
//                     JEE Mains-Cumulative Test
//                   </option>
//                   <option value="jeeadvanced">JEE Advanced</option>
//                   <option value="neet">NEET</option>
//                   <option value="neetparttest">NEET Part Test</option>
//                   <option value="neettough">NEET Tough</option>
//                   <option value="neetmoderate">NEET Moderate</option>
//                   <option value="topictest">Topic Test</option>
//                   <option value="quiztest">Quiz Test</option>
//                   <option value="other">Other</option>
//                 </select>

//                 <button type="submit">
//                   <span>{loading ? "Loading..." : "Next"}</span>
//                   <FaGreaterThan className="arrow" />
//                 </button>
//               </form>
//               {error && <p className="error-message">{error}</p>}
//             </div>
//           </div>
//         )}

//         {/* 🔹 STEP 2 */}
//         {step === 2 && (
//           <div className="step2-container">
//             <div className="step2-card">
//               <div className="step2-header">
//                 Click on Test Date To View Result
//               </div>

//               <table className="step2-table">
//                 <thead>
//                   <tr>
//                     <th>Test Date</th>
//                     <th></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {tests.map((t, idx) => (
//                     <tr key={idx}>
//                       <td>{t}</td>
//                       <td>
//                         <button
//                           className="step2-btn"
//                           onClick={() => handleViewResult(t)}
//                         >
//                           View Result <span className="arrow">➜</span>
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <button
//                 className="secondary-btn"
//                 onClick={() => {
//                   setStep(1);
//                   setTests([]);
//                 }}
//               >
//                 ⬅ Back
//               </button>
//             </div>
//           </div>
//         )}

//         {/* 🔹 STEP 3 */}
//         {step === 3 && (
//           <div className="step3-container">
//             <div className="step3-card">
//               <div className="step3-header">
//                 Results of {batch} ({testType}) - {selectedTest?.testDate}
//                 <button
//                   className="back-btn"
//                   onClick={() => {
//                     setStep(2);
//                     setResults([]);
//                   }}
//                 >
//                   ⬅ Back
//                 </button>
//               </div>

//               {/* ✅ Results Table */}
//               <div className="result-table">
//                 {results.length > 0 ? (
//                   <table className="results-table">
//                     <thead>
//                       <tr>
//                         <th>Rank</th>
//                         <th>Name</th>
//                         <th>Father's Name</th>
//                         <th>Student Code</th>
//                         <th>Batch</th>
//                         <th>Test Type</th>
//                         <th>Physics (Correct)</th>
//                         <th>Physics (Incorrect)</th>
//                         <th>Physics (Total)</th>
//                         <th>Chemistry (Correct)</th>
//                         <th>Chemistry (Incorrect)</th>
//                         <th>Chemistry (Total)</th>

//                         {isNeetBatch && (
//                           <>
//                             <th>Biology (Correct)</th>
//                             <th>Biology (Incorrect)</th>
//                             <th>Biology (Total)</th>
//                           </>
//                         )}

//                         {isZBatchOther && (
//                           <>
//                             <th>Mathematics (Correct)</th>
//                             <th>Mathematics (Incorrect)</th>
//                             <th>Mathematics (Total)</th>
//                             <th>Biology (Correct)</th>
//                             <th>Biology (Incorrect)</th>
//                             <th>Biology (Total)</th>
//                           </>
//                         )}

//                         {!isNeetBatch && !isZBatchOther && (
//                           <>
//                             <th>Mathematics (Correct)</th>
//                             <th>Mathematics (Incorrect)</th>
//                             <th>Mathematics (Total)</th>
//                           </>
//                         )}

//                         <th>Total Marks</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {(() => {
//                         let rankMap = {};
//                         let rankCounter = 1;

//                         results.forEach((r) => {
//                           if (!(r.totalMarks in rankMap)) {
//                             rankMap[r.totalMarks] = rankCounter++;
//                           }
//                         });

//                         return results.map((result, index) => {
//                           const rank = rankMap[result.totalMarks];
//                           return (
//                             <tr key={index}>
//                               <td>
//                                 {rank === 1
//                                   ? "🥇"
//                                   : rank === 2
//                                   ? "🥈"
//                                   : rank === 3
//                                   ? "🥉"
//                                   : rank}
//                               </td>
//                               <td>{result.name}</td>
//                               <td>{result.fatherName}</td>
//                               <td className="code-cell">
//                                 {result.studentCode}
//                               </td>
//                               <td>{result.batch}</td>
//                               <td>{result.testType}</td>
//                               <td>
//                                 {result.subjectMarks?.physics?.correctMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.physics?.incorrectMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.physics?.totalMark ?? "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.correctMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.incorrectMark ??
//                                   "-"}
//                               </td>
//                               <td>
//                                 {result.subjectMarks?.chemistry?.totalMark ??
//                                   "-"}
//                               </td>

//                               {isNeetBatch && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.biology?.correctMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.incorrectMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.totalMark ??
//                                       "-"}
//                                   </td>
//                                 </>
//                               )}

//                               {isZBatchOther && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.correctMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.incorrectMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.totalMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.correctMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.incorrectMark ??
//                                       "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.biology?.totalMark ??
//                                       "-"}
//                                   </td>
//                                 </>
//                               )}

//                               {!isNeetBatch && !isZBatchOther && (
//                                 <>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.correctMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.incorrectMark ?? "-"}
//                                   </td>
//                                   <td>
//                                     {result.subjectMarks?.mathematics
//                                       ?.totalMark ?? "-"}
//                                   </td>
//                                 </>
//                               )}

//                               <td className="marks-cell">
//                                 {result.totalMarks ?? "-"}
//                               </td>
//                             </tr>
//                           );
//                         });
//                       })()}
//                     </tbody>
//                   </table>
//                 ) : (
//                   <p className="ptag">No results found.</p>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BatchResults;


import React, { useState, useEffect,useRef} from "react";
import axios from "axios";
import "../styles/BatchResults.css";
import { FaArrowRight } from "react-icons/fa6";


const BatchResults = () => {
  const [batch, setBatch] = useState("");
  const [testType, setTestType] = useState("");
  const [tests, setTests] = useState([]); // store available test dates
  const [selectedTest, setSelectedTest] = useState(null);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [batches, setBatches] = useState([]);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const passwordInputRef = useRef(null);
  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const res = await axios.get(
        "https://result-analyserr.onrender.com/api/batches"
      );
      setBatches(res.data);
    } catch (err) {
      console.error("Error fetching batches", err);
    }
  };

  // 🔹 Step 1 → fetch test dates for batch & testType
  const handleBatchTypeSubmit = async (e) => {
    e.preventDefault();
    if (!batch || !testType) return;

    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/testdates?batch=${batch}&testType=${testType}`
      );

      if (!res.data || res.data.length === 0) {
        setError("No test dates found for this selection.");
        setTests([]);
        return;
      }

      setTests(res.data);
      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Something went wrong fetching test dates.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Step 2 → fetch results for selected test
  const handleViewResult = async (testDate) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/results/batch/${batch}?testType=${testType}&testDate=${testDate}`
      );

      if (!res.data || res.data.length === 0) {
        setError("No results found for this test.");
        setResults([]);
        return;
      }

      // sort by marks
      const sorted = res.data.sort(
        (a, b) => (b.totalMarks || 0) - (a.totalMarks || 0)
      );

      setResults(sorted);
      setSelectedTest({ testDate });
      setStep(3);
    } catch (err) {
      console.error(err);
      setError("Something went wrong fetching results.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Subject display rules
  const isNeetBatch =
    results.length > 0 &&
    ["neet", "neettough", "neetmoderate", "neetparttest"].includes(
      results[0]?.testType?.toLowerCase()
    );

  const isZBatchOther =
    results.length > 0 &&
    results[0]?.batch?.toLowerCase() === "z" &&
    results[0]?.testType?.toLowerCase() === "other";
  const handlePasswordSubmit = () => {
    if (password === "135246") {
      setIsAuthorized(true);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      alert("❌ Incorrect Password. Try Again.");
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
    <div className="viewresult-bg-batch">
      <div className="viewresult-container-batch">
        {/* 🔹 STEP 1 */}
        {step === 1 && (
          <div className="step1-container-batch">
            <div className="viewresult-card-batch">
              <div className="viewresult-header-batch">
                Select Batch & Test Type To View Results
              </div>

              <form
                onSubmit={handleBatchTypeSubmit}
                className="viewresult-form-batch"
              >
                <label className="form-label-batch">Batch</label>
                <select
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((b) => (
                    <option key={b._id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>

                <label className="form-label-batch">Test Type</label>
                <select
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                  required
                >
                  <option value="">Select Test Type</option>
                  <option value="jeemains">JEE Mains</option>
                  <option value="jeemainsparttest">JEE Mains-Part Test</option>
                  <option value="jeemainscumulativetest">
                    JEE Mains-Cumulative Test
                  </option>
                  <option value="jeeadvanced">JEE Advanced</option>
                  <option value="neet">NEET</option>
                  <option value="neetparttest">NEET Part Test</option>
                  <option value="neettough">NEET Tough</option>
                  <option value="neetmoderate">NEET Moderate</option>
                  <option value="topictest">Topic Test</option>
                  <option value="quiztest">Quiz Test</option>
                  <option value="other">Other</option>
                </select>

                <button type="submit">
                  <span className="viewresultbatchbtn">{loading ? "Loading..." : "View Result"}</span>
                  {/* <FaGreaterThan className="arrow-batch" /> */}
                   <FaArrowRight className="arrow-batch"/>
                </button>
              </form>
              {error && <p className="error-message-batch">{error}</p>}
            </div>
          </div>
        )}

        {/* 🔹 STEP 2 */}
        {step === 2 && (
          <div className="step2-container-batch">
            <div className="step2-card-batch">
              <div className="step2-header-batch">
                Click on Test Date To View Result
                <button
                className="secondary-btn-batch"
                onClick={() => {
                  setStep(1);
                  setTests([]);
                }}
              >
                ⬅ Back
              </button>
              </div>

              <table className="step2-table-batch">
                <thead>
                  <tr>
                    <th>Test Date</th>
                    <th>View Result</th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t}</td>
                      <td>
                        <button
                          className="step2-btn-batch"
                          onClick={() => handleViewResult(t)}
                        >
                          View Result <span className="arrow-batch">➜</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🔹 STEP 3 */}
        {step === 3 && (
          <div className="step3-container-batch">
            <div className="step3-card-batch">
              <div className="step3-header-batch">
                Results of {batch} ({testType}) - {selectedTest?.testDate}
                <button
                  className="back-btn-batch"
                  onClick={() => {
                    setStep(2);
                    setResults([]);
                  }}
                >
                  ⬅ Back
                </button>
              </div>

              {/* ✅ Results Table */}
              <div className="result-table-batch">
                {results.length > 0 ? (
                  <table className="results-table-batch">
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
                              <td className="code-cell-batch">
                                {result.studentCode}
                              </td>
                              <td>{result.batch}</td>
                              <td>{result.testType}</td>
                              <td>
                                {result.subjectMarks?.physics?.correctMark ??
                                  "-"}
                              </td>
                              <td>
                                {result.subjectMarks?.physics?.incorrectMark ??
                                  "-"}
                              </td>
                              <td>
                                {result.subjectMarks?.physics?.totalMark ?? "-"}
                              </td>
                              <td>
                                {result.subjectMarks?.chemistry?.correctMark ??
                                  "-"}
                              </td>
                              <td>
                                {result.subjectMarks?.chemistry?.incorrectMark ??
                                  "-"}
                              </td>
                              <td>
                                {result.subjectMarks?.chemistry?.totalMark ??
                                  "-"}
                              </td>

                              {isNeetBatch && (
                                <>
                                  <td>
                                    {result.subjectMarks?.biology?.correctMark ??
                                      "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.biology?.incorrectMark ??
                                      "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.biology?.totalMark ??
                                      "-"}
                                  </td>
                                </>
                              )}

                              {isZBatchOther && (
                                <>
                                  <td>
                                    {result.subjectMarks?.mathematics
                                      ?.correctMark ?? "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.mathematics
                                      ?.incorrectMark ?? "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.mathematics
                                      ?.totalMark ?? "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.biology?.correctMark ??
                                      "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.biology?.incorrectMark ??
                                      "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.biology?.totalMark ??
                                      "-"}
                                  </td>
                                </>
                              )}

                              {!isNeetBatch && !isZBatchOther && (
                                <>
                                  <td>
                                    {result.subjectMarks?.mathematics
                                      ?.correctMark ?? "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.mathematics
                                      ?.incorrectMark ?? "-"}
                                  </td>
                                  <td>
                                    {result.subjectMarks?.mathematics
                                      ?.totalMark ?? "-"}
                                  </td>
                                </>
                              )}

                              <td className="marks-cell-batch">
                                {result.totalMarks ?? "-"}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                ) : (
                  <p className="ptag-batch">No results found.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchResults;


