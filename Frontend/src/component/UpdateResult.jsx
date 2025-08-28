// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// // import "../styles/UpdateResult.css";

// const UpdateResult = () => {
//   const [batch, setBatch] = useState("");
//   const [testDate, setTestDate] = useState("");
//   const [batches, setBatches] = useState([]);
//   const [results, setResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [password, setPassword] = useState("");
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const passwordInputRef = useRef(null);
//   const [saving, setSaving] = useState(false);

//   // 🔹 Fetch available batches
//   useEffect(() => {
//     const fetchBatches = async () => {
//       try {
//         const res = await axios.get(
//         "https://result-analyserr.onrender.comhttps://result-analyserr.onrender.comhttps://result-analyserr.onrender.com/api/batches"
//         );
//         setBatches(res.data);
//       } catch (err) {
//         console.error("Error fetching batches", err);
//       }
//     };
//     fetchBatches();
//   }, []);

//   // 🔹 Fetch results for batch + testDate
//   const handleFetchResults = async (e) => {
//     e.preventDefault();
//     if (!batch || !testDate) return;

//     setLoading(true);
//     setError("");
//     try {
//       const res = await axios.get(
//         `https://result-analyserr.onrender.comhttps://result-analyserr.onrender.comhttps://result-analyserr.onrender.com/api/results/batch/${batch}?testDate=${testDate}`
//       );

//       if (!res.data || res.data.length === 0) {
//         setError("No results found.");
//         setResults([]);
//         return;
//       }

//       setResults(res.data);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong fetching results.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔹 Handle inline edits
//   const handleEdit = (index, field, value) => {
//     const updatedResults = [...results];
//     updatedResults[index][field] = value;
//     setResults(updatedResults);
//   };

//   // 🔹 Save updates to DB
//   const handleSaveUpdates = async () => {
//     setSaving(true);
//     try {
//       const res = await axios.put(
//         "https://result-analyserr.onrender.comhttps://result-analyserr.onrender.comhttps://result-analyserr.onrender.com/api/results/update",
//         { results }
//       );

//       if (res.data.success) {
//         alert("✅ Results updated successfully!");
//       } else {
//         alert("⚠️ Some issue occurred while updating.");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("❌ Error updating results.");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // 🔹 Password check
//   const handlePasswordSubmit = () => {
//     if (password === "135246") {
//       setIsAuthorized(true);
//       setTimeout(() => passwordInputRef.current?.focus(), 100);
//     } else {
//       alert("❌ Incorrect Password. Try Again.");
//     }
//   };

//   if (!isAuthorized) {
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
//     <div className="updateresult-bg">
//       <div className="updateresult-container">
//         <h2>📋 Update Results</h2>

//         <form onSubmit={handleFetchResults} className="updateresult-form">
//           <label>Batch</label>
//           <select
//             value={batch}
//             onChange={(e) => setBatch(e.target.value)}
//             required
//           >
//             <option value="">Select Batch</option>
//             {batches.map((b) => (
//               <option key={b._id} value={b.name}>
//                 {b.name}
//               </option>
//             ))}
//           </select>

//           <label>Test Date</label>
//           <input
//             type="date"
//             value={testDate}
//             onChange={(e) => setTestDate(e.target.value)}
//             required
//           />

//           <button className="primary-btn" type="submit" disabled={loading}>
//             {loading ? "Loading..." : "Fetch Results"}
//           </button>
//         </form>

//         {error && <p className="error-msg">{error}</p>}

//         {/* Show results */}
//         {results.length > 0 && (
//           <div className="results-table">
//             <h3>
//               Results of {batch} - {testDate}
//             </h3>
//             <table>
//               <thead>
//                 <tr>
//                   <th>Code</th>
//                   <th>Name</th>
//                   <th>Father</th>
//                   <th>Total Marks</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {results.map((r, idx) => (
//                   <tr key={idx}>
//                     <td>{r.studentCode}</td>
//                     <td>{r.name}</td>
//                     <td>{r.fatherName}</td>
//                     <td>
//                       <input
//                         type="number"
//                         value={r.totalMarks || ""}
//                         onChange={(e) =>
//                           handleEdit(idx, "totalMarks", e.target.value)
//                         }
//                         style={{ width: "80px" }}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             <button
//               className="primary-btn save-btn"
//               onClick={handleSaveUpdates}
//               disabled={saving}
//             >
//               {saving ? "Saving..." : "Save Updates"}
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UpdateResult;


import React, { useState, useEffect } from "react";
import axios from "axios";

const UpdateResult = () => {
  const [batches, setBatches] = useState([]);
  const [batch, setBatch] = useState("");
  const [testDate, setTestDate] = useState("");
  const [results, setResults] = useState([]);
  const [editing, setEditing] = useState({}); // track edits
  const [loading, setLoading] = useState(false);

  // Fetch batches on mount
  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const res = await axios.get("https://result-analyserr.onrender.com/api/batches");
        setBatches(res.data || []);
      } catch (err) {
        console.error("Error fetching batches:", err);
      }
    };
    fetchBatches();
  }, []);

  // Fetch results when batch + date selected
  const handleFetchResults = async () => {
    if (!batch || !testDate) return alert("Please select batch and date");
    try {
      setLoading(true);
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/results?batch=${batch}&testDate=${testDate}`
      );
      const data = Array.isArray(res.data) ? res.data : [res.data];
      console.log("Results from backend:",data);
      setResults(data);
    } catch (err) {
      console.error("Error fetching results:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle editing change
  const handleChange = (studentCode, subject, field, value) => {
    setEditing((prev) => ({
      ...prev,
      [studentCode]: {
        ...prev[studentCode],
        [subject]: {
          ...prev[studentCode]?.[subject],
          [field]: value,
        },
      },
    }));
  };

  // Save updates
  // Save updates
const handleSave = async (studentCode) => {
  try {
    const updatedData = editing[studentCode];
    if (!updatedData) return;

    // Construct payload only with edited data
    const payload = {
      testDate,
      batch,
      subjectMarks: updatedData, // only changed subjects/fields
    };

    // If overall was edited, include it
    if (updatedData.overall) {
      if (updatedData.overall.totalMarks !== undefined)
        payload.totalMarks = updatedData.overall.totalMarks;
      if (updatedData.overall.maxMarks !== undefined)
        payload.maxMarks = updatedData.overall.maxMarks;
    }

    await axios.put(`https://result-analyserr.onrender.com/api/results/${studentCode}`, payload);

    alert("Result updated successfully");

    setEditing((prev) => {
      const newEdits = { ...prev };
      delete newEdits[studentCode];
      return newEdits;
    });

    handleFetchResults(); // refresh results
  } catch (err) {
    console.error("Error updating result:", err);
  }
};




  return (
    <div className="update-results-container">
      <h2>Update Student Results</h2>

      {/* Batch Dropdown */}
      <div className="filters">
       <select value={batch} onChange={(e) => setBatch(e.target.value)}>
  <option value="">Select Batch</option>
  {batches.map((b, idx) => (
    <option key={b._id || idx} value={b.name}>
      {b.name}
    </option>
  ))}
</select>


        {/* Test Date */}
        <input
          type="date"
          value={testDate}
          onChange={(e) => setTestDate(e.target.value)}
        />

        <button onClick={handleFetchResults}>Fetch Results</button>
      </div>

      {loading && <p>Loading...</p>}

      {Array.isArray(results) && results.length > 0 ? (
        <table border="1" cellPadding="6" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Student Code</th>
              <th>Name</th>
              <th>Father Name</th>
              <th>Batch</th>
              <th>Test Date</th>
              <th>Physics</th>
              <th>Chemistry</th>
              <th>Biology</th>
              <th>Mathematics</th>
              <th>Total Marks</th>
              <th>Max Marks</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
{results.map((result, index) => {
  const { studentCode, name, fatherName, testDate, batch } = result;
  const subjects = ["physics", "chemistry", "biology", "mathematics"];

  return (
    <tr key={index}>
      <td>{studentCode}</td>
      <td>{name}</td>
      <td>{fatherName}</td>
      <td>{batch}</td>
      <td>{testDate?.substring(0, 10)}</td>

      {subjects.map((subj) => (
        <td key={subj}>
          {["totalMark", "correctMark", "incorrectMark", "obtainedMark"].map(
            (field) => (
              <div key={field}>
                {field}:{" "}
                <input
                  type="number"
                  value={
                    editing[studentCode]?.[subj]?.[field] ??
                    result.subjectMarks?.[subj]?.[field] ??
                    ""
                  }
                  placeholder="-"
                  onChange={(e) =>
                    handleChange(studentCode, subj, field, e.target.value)
                  }
                  style={{ width: "60px" }}
                />
              </div>
            )
          )}
        </td>
      ))}

      {/* Editable totalMarks */}
      <td>
        <input
          type="number"
          value={
            editing[studentCode]?.totalMarks ?? result.totalMarks ?? ""
          }
          placeholder="-"
          onChange={(e) =>
            handleChange(studentCode, "overall", "totalMarks", e.target.value)
          }
          style={{ width: "70px" }}
        />
      </td>

      {/* Editable maxMarks */}
      <td>
        <input
          type="number"
          value={
            editing[studentCode]?.maxMarks ?? result.maxMarks ?? ""
          }
          placeholder="-"
          onChange={(e) =>
            handleChange(studentCode, "overall", "maxMarks", e.target.value)
          }
          style={{ width: "70px" }}
        />
      </td>

      <td>
        <button onClick={() => handleSave(studentCode)}>Save</button>
      </td>
    </tr>
  );
})}
          </tbody>
        </table>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default UpdateResult;

