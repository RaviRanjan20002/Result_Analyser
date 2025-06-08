

// import React, { useState,useRef} from "react";
// import axios from "axios";
// import "../styles/Quiztest.css"; // <-- CSS import

// const QuizTestPerformance = () => {
//   const [batch, setBatch] = useState("");
//   const [filter, setFilter] = useState("");

// const [maxMark1, setMaxMark1] = useState("");
// const [maxMark2, setMaxMark2] = useState("");
// const [maxMark3, setMaxMark3] = useState("");

//   const [results, setResults] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//     const [password, setPassword] = useState("");
//     const [isAuthorized, setIsAuthorized] = useState(false);
//     const passwordInputRef = useRef(null);
  
//     const handlePasswordSubmit = () => {
//       if (password === "135246") {
//         setIsAuthorized(true);
//         setTimeout(() => passwordInputRef.current?.focus(), 100);
//       } else {
//         alert("❌ Incorrect Password. Try Again.");
//       }
//     };
//   const fetchBatchResults = async () => {
//     if (!batch || !maxMarks) {
//       setError("Please select a batch and enter max marks.");
//       return;
//     }
//     setError("");
//     setLoading(true);

//     try {
//       const response = await axios.get(`https://result-analyserr.onrender.com/api/quiz-performance/${batch}`, {
//         params: {
//           filter,
//           max1: maxMark1,
//           max2: maxMark2,
//           max3: maxMark3,
//         },
//       });
      
//       setResults(response.data);
//     } catch (err) {
//       setResults([]);
//       setError("No results found for this batch in Quiz Tests.");
//     }
//     finally{
//       setLoading(false);
//     }
//   };
//   if (!isAuthorized) {
//     return (
//       <div className="Setcontainer">
//         <h2>👁️FOR OFFICE USE ONLY</h2>
//         <input
//           ref={passwordInputRef}
//           type="password"
//           placeholder="Enter Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         <button className="passwordbttn" onClick={handlePasswordSubmit}>
//           Submit
//         </button>
//       </div>
//     );
//   }
//   return (
//     <div className="quiz-performance-container">
//       <h2>Quiz Test Performance</h2>

//       <select className="quiz-select" onChange={(e) => setBatch(e.target.value)} value={batch}>
//         <option value="">Select Batch</option>
//         <option value="Arjun">Arjun</option>
//         <option value="Eklavya">Eklavya</option>
//         <option value="Bhism">Bhism</option>
//         <option value="Bheem">Bheem</option>
//         <option value="Madhav">Madhav</option>
//         <option value="Dron">Dron</option>
//         <option value="Nakul">Nakul</option>
//         <option value="Toppers">Toppers</option>
//       </select>

//       <input
//   type="number"
//   placeholder="Max Marks for Test 1"
//   value={maxMark1}
//   onChange={(e) => setMaxMark1(e.target.value)}
//   className="quiz-input"
// />
// <input
//   type="number"
//   placeholder="Max Marks for Test 2"
//   value={maxMark2}
//   onChange={(e) => setMaxMark2(e.target.value)}
//   className="quiz-input"
// />
// <input
//   type="number"
//   placeholder="Max Marks for Test 3"
//   value={maxMark3}
//   onChange={(e) => setMaxMark3(e.target.value)}
//   className="quiz-input"
// />


//       <select className="quiz-select" onChange={(e) => setFilter(e.target.value)} value={filter}>
//         <option value="">Select the required Filter</option>
//         {/* <option value="above75">Above 75% (Single Test)</option>
//         <option value="below75">Below 75% (Single Test)</option> */}
//         {/* <option value="above75Last3">Above 75% (Last 3 Consecutive Tests)</option> */}
//         <option value="below75Last3">Below 75% (Last 3 Consecutive Tests)</option>
//       </select>

//       <button className="quiz-button" onClick={fetchBatchResults}>Search</button>

//       {error && <p className="quiz-error">{error}</p>}
//      {/* SHOW "Searching..." WHEN LOADING */}
//      {loading && (
//         <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
//           Searching...
//         </p>
//       )}
//       {results.length > 0 ? (
//         <div className="quiz-table-wrapper">
//           <table className="quiz-table">
//             <thead>
//               <tr>
//                 <th>Test Date</th>
//                 <th>Name</th>
//                 <th>Father's Name</th>
//                 <th>Batch</th>
//                 <th>Test Type</th>
//                 <th>Physics (Correct)</th>
//                 <th>Physics (Incorrect)</th>
//                 <th>Physics (Total)</th>
//                 <th>Chemistry (Correct)</th>
//                 <th>Chemistry (Incorrect)</th>
//                 <th>Chemistry (Total)</th>
//                 <th>Math (Correct)</th>
//                 <th>Math (Incorrect)</th>
//                 <th>Math (Total)</th>
//                 <th>Total Marks</th>
//               </tr>
//             </thead>
//             <tbody>
//               {results.map((result, index) => (
//                 <tr key={index}>
//                   <td>{result.testDate}</td>
//                   <td>{result.name}</td>
//                   <td>{result.fatherName}</td>
//                   <td>{result.batch}</td>
//                   <td>{result.testType}</td>
//                   <td>{result.subjectMarks?.physics?.correctMark ?? "-"}</td>
//                   <td>{result.subjectMarks?.physics?.incorrectMark ?? "-"}</td>
//                   <td>{result.subjectMarks?.physics?.totalMark ?? "-"}</td>
//                   <td>{result.subjectMarks?.chemistry?.correctMark ?? "-"}</td>
//                   <td>{result.subjectMarks?.chemistry?.incorrectMark ?? "-"}</td>
//                   <td>{result.subjectMarks?.chemistry?.totalMark ?? "-"}</td>
//                   <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
//                   <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td>
//                   <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
//                   <td>{result.totalMarks ?? "-"}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p className="quiz-empty-msg">No results found.</p>
//       )}
//     </div>
//   );
// };

// export default QuizTestPerformance;


import React, { useState, useRef } from "react";
import axios from "axios";
import "../styles/Quiztest.css";

const QuizTestPerformance = () => {
  const [batch, setBatch] = useState("");
  const [filter, setFilter] = useState("");
  const [maxMarks1, setMaxMarks1] = useState("");
  const [maxMarks2, setMaxMarks2] = useState("");
  const [maxMarks3, setMaxMarks3] = useState("");
  const [results, setResults] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const passwordInputRef = useRef(null);

  const handlePasswordSubmit = () => {
    if (password === "135246") {
      setIsAuthorized(true);
      setTimeout(() => passwordInputRef.current?.focus(), 100);
    } else {
      alert("❌ Incorrect Password. Try Again.");
    }
  };

  const fetchBatchResults = async () => {
    if (!batch || !maxMarks1 || !maxMarks2 || !maxMarks3) {
      setError("Please select a batch and enter all three max marks.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.get(
        `http://localhost:3001/api/quiz-performance/${batch}`,
        {
        params: {
  filter,
  max1: Number(maxMarks1),
  max2: Number(maxMarks2),
  max3: Number(maxMarks3),
}

        }
      );

      // Group by student
      const grouped = {};
      response.data.forEach((result) => {
        const key = `${result.name}-${result.fatherName}`;
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(result);
      });
      console.log("grouped", grouped);
      setResults(grouped);
    } catch (err) {
      setResults({});
      setError("No results found for this batch in Quiz Tests.");
    } finally {
      setLoading(false);
    }
  };
  
  const isNeetBatch = (() => {
    const firstKey = Object.keys(results)[0]; // Get the first key
    if (!firstKey) return false; // If no results, return false
    const firstResult = results[firstKey][0]; // Get the first result for the first student
    console.log("firstResult", firstResult);
    return ["dron", "madhav", "nakul"].includes(firstResult?.batch?.toLowerCase());
  })();
  
  console.log("isNeetBatch", isNeetBatch);
  
  const subjectName = isNeetBatch ? "Biology" : "Mathematics";
  console.log("subjectName", subjectName);
  if (!isAuthorized) {
    return (
      <div className="Setcontainer">
        <h2>👁️ FOR OFFICE USE ONLY</h2>
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
    <div className="quiz-performance-container">
      <h2>Quiz Test Performance</h2>

      <select
        className="quiz-select"
        onChange={(e) => setBatch(e.target.value)}
        value={batch}
      >
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
        placeholder="Enter Max Marks of Test 1"
        value={maxMarks1}
        onChange={(e) => setMaxMarks1(e.target.value)}
        className="quiz-input"
      />
      <input
        type="number"
        placeholder="Enter Max Marks of Test 2"
        value={maxMarks2}
        onChange={(e) => setMaxMarks2(e.target.value)}
        className="quiz-input"
      />
      <input
        type="number"
        placeholder="Enter Max Marks of Test 3"
        value={maxMarks3}
        onChange={(e) => setMaxMarks3(e.target.value)}
        className="quiz-input"
      />

<select
  className="quiz-select"
  onChange={(e) => setFilter(e.target.value)}
  value={filter}
>
  <option value="">Select the required Filter</option>
  <option value="below75Last3">
    Below 75% (Last 3 & Decreasing)
  </option>
</select>


      <button className="quiz-button" onClick={fetchBatchResults}>
        Search
      </button>

      {error && <p className="quiz-error">{error}</p>}
      {loading && (
        <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
          Searching...
        </p>
      )}

      {Object.keys(results).length > 0 ? (
        Object.keys(results).map((key, idx) => (
          <div key={idx} className="quiz-student-group">
            <h3>
              👤 {key.split("-")[0]} (Father: {key.split("-")[1]})
            </h3>
            <table className="quiz-table">
              <thead>
                <tr>
                  <th>Test Date</th>
                  <th>Batch</th>
                  <th>Test Type</th>
                  {/* <th>Physics (Marks)</th> */}
                  {/* <th>Physics (Incorrect)</th> */}
                  <th>Physics (Total Marks)</th>
                  {/* <th>Chemistry (Correct)</th>
                  <th>Chemistry (Incorrect)</th> */}
                  <th>Chemistry (Total Marks)</th>
                  {/* <th>Math (Correct)</th>
                  <th>Math (Incorrect)</th> */}
                  <th>{subjectName} (Total Marks)</th>
                  <th>Total Marks</th>
                </tr>
              </thead>
              <tbody>
                {results[key].map((result, i) => (
                  <tr key={i}>
                    <td>{result.testDate}</td>
                    <td>{result.batch}</td>
                    <td>{result.testType}</td>
                    {/* <td>{result.subjectMarks?.physics?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.physics?.incorrectMark ?? "-"}</td> */}
                    <td>{result.subjectMarks?.physics?.totalMark ?? "-"}</td>
                    {/* <td>{result.subjectMarks?.chemistry?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.chemistry?.incorrectMark ?? "-"}</td> */}
                    <td>{result.subjectMarks?.chemistry?.totalMark ?? "-"}</td>
                    {/* <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td> */}
                    {isNeetBatch ? (
                  <>
                    {/* <td>{result.subjectMarks?.biology?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.biology?.incorrectMark ?? "-"}</td> */}
                    <td>{result.subjectMarks?.biology?.totalMark ?? "-"}</td>
                  </>
                ) : (
                  <>
                    {/* <td>{result.subjectMarks?.mathematics?.correctMark ?? "-"}</td>
                    <td>{result.subjectMarks?.mathematics?.incorrectMark ?? "-"}</td> */}
                    <td>{result.subjectMarks?.mathematics?.totalMark ?? "-"}</td>
                  </>
                )}
                    <td>{result.totalMarks ?? "-"}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p className="quiz-empty-msg">No results found.</p>
      )}
    </div>
    
  );
};

export default QuizTestPerformance;







