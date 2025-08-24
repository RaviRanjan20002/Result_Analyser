// import React, { useState, useRef, useEffect } from "react";

// import axios from "axios";
// import "../styles/SetDetails.css";

// const SetDetails = () => {
//   const [password, setPassword] = useState("");
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const passwordInputRef = useRef(null);
//   const [submitting, setSubmitting] = useState(false);

//   const [formData, setFormData] = useState({
//     testDate: "",
//     studentCode: "",
//     testType: "jeemains",
//     subjectMarks: {
//       physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//       chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//       biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//       mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//     },
//     totalMarks: 0,
//   });

//   const [studentInfo, setStudentInfo] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handlePasswordSubmit = () => {
//     if (password === "135246") {
//       setIsAuthorized(true);
//       setTimeout(() => passwordInputRef.current?.focus(), 100);
//     } else {
//       alert("❌ Incorrect Password. Try Again.");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const fetchStudentByCode = async (code) => {
//     if (!code || code.length !== 5) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `https://result-analyserr.onrender.com/api/studentByCode/${code}`
//       );
//       if (res.data) {
//         setStudentInfo(res.data);
//       } else {
//         alert("❌ Failed to fetch student.");
//         setStudentInfo(null);
//       }
//     } catch (err) {
//       setStudentInfo(null);
//       alert("⚠️ Student not found for this Student code.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     if (formData.studentCode && formData.testDate && formData.testType) {
//       fetchStudentByCode(formData.studentCode);
//     }
//   }, [formData.studentCode, formData.testDate, formData.testType]);

//   const handleSubjectChange = (subject, field, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       subjectMarks: {
//         ...prevData.subjectMarks,
//         [subject]: {
//           ...prevData.subjectMarks[subject],
//           [field]: Number(value) || 0,
//         },
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!studentInfo) {
//       alert("⚠️ Student details not found for this code.");
//       return;
//     }
//     setSubmitting(true);

//     let totalMarks = 0;

//     // Physics + Chemistry always included
//     totalMarks += formData.subjectMarks.physics.totalMark;
//     totalMarks += formData.subjectMarks.chemistry.totalMark;

//     // NEET / NEET Tough / NEET Moderate → Biology only
//     if (
//       formData.testType === "neet" ||
//       formData.testType === "neettough" ||
//       formData.testType === "neetmoderate"
//     ) {
//       totalMarks += formData.subjectMarks.biology.totalMark;
//     }
//     // "other" + Z batch → both Mathematics and Biology
//     else if (formData.testType === "other" && studentInfo?.batch === "Z") {
//       totalMarks += formData.subjectMarks.mathematics.totalMark;
//       totalMarks += formData.subjectMarks.biology.totalMark;
//     }
//     // Default → Mathematics only
//     else {
//       totalMarks += formData.subjectMarks.mathematics.totalMark;
//     }

//     const payload = {
//       studentCode: formData.studentCode,
//       testType: formData.testType,
//       testDate: formData.testDate,
//       name: studentInfo.name,
//       fatherName: studentInfo.fatherName,
//       batch: studentInfo.batch,
//       subjectMarks: formData.subjectMarks,
//       totalMarks,
//     };

//     try {
//       await axios.post(
//         "https://result-analyserr.onrender.com/api/results",
//         payload
//       );
//       alert("✅ Result Saved Successfully!");
//       setFormData({
//         testDate: "",
//         studentCode: "",
//         testType: "jeemains",
//         subjectMarks: {
//           physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//           chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//           biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//           mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//         },
//         totalMarks: 0,
//       });
//       setStudentInfo(null);
//     } catch (err) {
//       if (err.response?.status === 409) {
//         alert(
//           "⚠️ Result already exists for this student, test type, and date."
//         );
//       } else {
//         alert("❌ Something went wrong while saving.");
//       }
//     }
//     setSubmitting(false);
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
//     <div className="setdetails-bg">
//       <div className="setdetails-card">
//         <h2 className="title">📖 Enter Student Result by Code</h2>
//         <form
//           id="student-form"
//           onSubmit={handleSubmit}
//           onKeyDown={(e) => {
//             if (e.key === "Enter") {
//               const form = e.target.form;
//               const index = Array.prototype.indexOf.call(form, e.target);

//               // Move to next input if available
//               if (index > -1 && index + 1 < form.elements.length) {
//                 e.preventDefault();
//                 form.elements[index + 1].focus();
//               }
//             }
//           }}
//         >
//           <div className="flex-row">
//             <div className="form-group">
//               <label>Date of Test</label>
//               <input
//                 type="date"
//                 name="testDate"
//                 className="inputcl"
//                 value={formData.testDate}
//                 onChange={handleChange}
//                 required
//               />
//             </div>
//             <div className="form-group">
//               <label>Student Code</label>
//               <input
//                 type="text"
//                 name="studentCode"
//                 className="inputcl"
//                 placeholder="5-digit Code"
//                 value={formData.studentCode}
//                 onChange={handleChange}
//                 maxLength={5}
//                 required
//                 autoFocus
//               />
//             </div>
//             <div className="form-group">
//               <label>Test Type</label>
//               <select
//                 name="testType"
//                 className="selectcl"
//                 onChange={handleChange}
//                 value={formData.testType}
//               >
//                 <option value="jeemains">JEE Mains</option>
//                 <option value="jeemainsparttest">JEE Mains-Part Test</option>
//                 <option value="jeemainscumulativetest">
//                   JEE Mains-Cumulative Test
//                 </option>
//                 <option value="jeeadvanced">JEE Advanced</option>
//                 <option value="neet">NEET</option>
//                 <option value="neettough">NEET Tough</option>
//                 <option value="neetmoderate">NEET Moderate</option>
//                 <option value="topictest">Topic Test</option>
//                 <option value="quiztest">Quiz Test</option>
//                 <option value="other">Other</option>
//               </select>
//             </div>
//           </div>

//           {loading && <p className="info-msg">Loading student details...</p>}

//           {studentInfo && (
//             <div className="student-info-card bounce-in">
//               <div>
//                 <span className="icon user">&#128100;</span>
//                 <b>{studentInfo.name}</b>
//               </div>
//               <div>
//                 <span className="icon">&#128106;</span>
//                 {studentInfo.fatherName}
//               </div>
//               <div>
//                 <span className="icon">&#127891;</span>
//                 Batch: <b>{studentInfo.batch}</b>
//               </div>
//             </div>
//           )}

//           <div className="subject-section">
//             {/* Always show Physics & Chemistry */}
//             {["physics", "chemistry"].map((subject) => (
//               <div className="subject-card" key={subject}>
//                 <div className="subject-title">{subject.toUpperCase()}</div>
//                 {["correctMark", "incorrectMark", "totalMark"].map(
//                   (type, idx) => (
//                     <input
//                       key={type}
//                       type="number"
//                       placeholder={
//                         type === "correctMark"
//                           ? "Correct"
//                           : type === "incorrectMark"
//                           ? "Incorrect"
//                           : "Total"
//                       }
//                       className={`marks-input ${idx === 2 ? "totalmark" : ""}`}
//                       value={formData.subjectMarks[subject][type]}
//                       onChange={(e) =>
//                         handleSubjectChange(subject, type, e.target.value)
//                       }
//                       {...(type !== "totalMark" ? { min: 0 } : {})}
//                       required
//                     />
//                   )
//                 )}
//               </div>
//             ))}

//             {/* Conditional Subjects */}
//             {formData.testType === "neet" ||
//             formData.testType === "neettough" ||
//             formData.testType === "neetmoderate" ? (
//               // Show Biology only
//               <div className="subject-card">
//                 <div className="subject-title">BIOLOGY</div>
//                 {["correctMark", "incorrectMark", "totalMark"].map(
//                   (type, idx) => (
//                     <input
//                       key={type}
//                       type="number"
//                       placeholder={
//                         type === "correctMark"
//                           ? "Correct"
//                           : type === "incorrectMark"
//                           ? "Incorrect"
//                           : "Total"
//                       }
//                       className={`marks-input ${idx === 2 ? "totalmark" : ""}`}
//                       value={formData.subjectMarks.biology[type]}
//                       onChange={(e) =>
//                         handleSubjectChange("biology", type, e.target.value)
//                       }
//                       {...(type !== "totalMark" ? { min: 0 } : {})}
//                       required
//                     />
//                   )
//                 )}
//               </div>
//             ) : formData.testType === "other" || studentInfo?.batch === "Z" ? (
//               // Show Both Mathematics and Biology
//               <>
//                 {["mathematics", "biology"].map((subject) => (
//                   <div className="subject-card" key={subject}>
//                     <div className="subject-title">{subject.toUpperCase()}</div>
//                     {["correctMark", "incorrectMark", "totalMark"].map(
//                       (type, idx) => (
//                         <input
//                           key={type}
//                           type="number"
//                           placeholder={
//                             type === "correctMark"
//                               ? "Correct"
//                               : type === "incorrectMark"
//                               ? "Incorrect"
//                               : "Total"
//                           }
//                           className={`marks-input ${
//                             idx === 2 ? "totalmark" : ""
//                           }`}
//                           value={formData.subjectMarks[subject][type]}
//                           onChange={(e) =>
//                             handleSubjectChange(subject, type, e.target.value)
//                           }
//                           {...(type !== "totalMark" ? { min: 0 } : {})}
//                           required
//                         />
//                       )
//                     )}
//                   </div>
//                 ))}
//               </>
//             ) : (
//               // Default: Show Mathematics only
//               <div className="subject-card">
//                 <div className="subject-title">MATHEMATICS</div>
//                 {["correctMark", "incorrectMark", "totalMark"].map(
//                   (type, idx) => (
//                     <input
//                       key={type}
//                       type="number"
//                       placeholder={
//                         type === "correctMark"
//                           ? "Correct"
//                           : type === "incorrectMark"
//                           ? "Incorrect"
//                           : "Total"
//                       }
//                       className={`marks-input ${idx === 2 ? "totalmark" : ""}`}
//                       value={formData.subjectMarks.mathematics[type]}
//                       onChange={(e) =>
//                         handleSubjectChange("mathematics", type, e.target.value)
//                       }
//                       {...(type !== "totalMark" ? { min: 0 } : {})}
//                       required
//                     />
//                   )
//                 )}
//               </div>
//             )}
//           </div>
//           <button
//             type="submit"
//             className="primary-btn wide-btn"
//             disabled={submitting}
//           >
//             {submitting ? "⏳ Submitting..." : "💾 Save Details"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SetDetails;






import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "../styles/SetDetails.css";

const SetDetails = () => {
  const [password, setPassword] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);
  const passwordInputRef = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState(null);

  const columns = [
    { key: "totalMark", label: "Total Marks" },
    { key: "correctMark", label: "Positive Marks" },
    { key: "incorrectMark", label: "Negative Marks" },
    { key: "obtainedMark", label: "Obtained Marks" }
  ];

  const [formData, setFormData] = useState({
    testDate: "",
    studentCode: "",
    testType: "jeemains",
    subjectMarks: {
      physics: { totalMark: 0, correctMark: 0, incorrectMark: 0, obtainedMark: 0 },
      chemistry: { totalMark: 0, correctMark: 0, incorrectMark: 0, obtainedMark: 0 },
      biology: { totalMark: 0, correctMark: 0, incorrectMark: 0, obtainedMark: 0 },
      mathematics: { totalMark: 0, correctMark: 0, incorrectMark: 0, obtainedMark: 0 },
    },
    totalMarks: 0,
  });

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchStudentByCode = async (code) => {
    if (!code || code.length !== 5) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `https://result-analyserr.onrender.com/api/studentByCode/${code}`
      );
      if (res.data) {
        setStudentInfo(res.data);
      } else {
        alert("❌ Failed to fetch student.");
        setStudentInfo(null);
      }
    } catch {
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

  // Auto-calc obtained marks when positive/negative change
 const handleSubjectChange = (subject, field, value) => {
  setFormData((prevData) => {
    const updatedSubject = {
      ...prevData.subjectMarks[subject],
      [field]: Number(value) || 0
    };

    // Auto-calc obtained mark
    if (field === "correctMark" || field === "incorrectMark") {
      updatedSubject.obtainedMark =
        (updatedSubject.correctMark || 0) -
        (updatedSubject.incorrectMark || 0);
    }

    // Prepare updated subjectMarks
    const updatedSubjectMarks = {
      ...prevData.subjectMarks,
      [subject]: updatedSubject
    };

    // Auto-calc totalMarks from obtained marks
    let totalMarks = 0;
    if (["neet", "neettough", "neetmoderate"].includes(prevData.testType)) {
      totalMarks =
        (updatedSubjectMarks.physics?.obtainedMark || 0) +
        (updatedSubjectMarks.chemistry?.obtainedMark || 0) +
        (updatedSubjectMarks.biology?.obtainedMark || 0);
    } else if (prevData.testType === "other" || studentInfo?.batch === "Z") {
      totalMarks =
        (updatedSubjectMarks.physics?.obtainedMark || 0) +
        (updatedSubjectMarks.chemistry?.obtainedMark || 0) +
        (updatedSubjectMarks.mathematics?.obtainedMark || 0) +
        (updatedSubjectMarks.biology?.obtainedMark || 0);
    } else {
      totalMarks =
        (updatedSubjectMarks.physics?.obtainedMark || 0) +
        (updatedSubjectMarks.chemistry?.obtainedMark || 0) +
        (updatedSubjectMarks.mathematics?.obtainedMark || 0);
    }

    return {
      ...prevData,
      subjectMarks: updatedSubjectMarks,
      totalMarks
    };
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!studentInfo) {
    alert("⚠️ Student details not found for this code.");
    return;
  }
  setSubmitting(true);

  let totalMarks = 0;
  let maxMarks = 0;

  // Physics + Chemistry always
  totalMarks += formData.subjectMarks.physics.obtainedMark;
  totalMarks += formData.subjectMarks.chemistry.obtainedMark;

  maxMarks += formData.subjectMarks.physics.totalMark;
  maxMarks += formData.subjectMarks.chemistry.totalMark;

  // NEET types → Biology
  if (
    formData.testType === "neet" ||
    formData.testType === "neettough" ||
    formData.testType === "neetparttest" ||
    formData.testType === "neetmoderate"
  ) {
    totalMarks += formData.subjectMarks.biology.obtainedMark;
    maxMarks += formData.subjectMarks.biology.totalMark;
  }
  // "other" + Z batch → Math + Bio
  else if (formData.testType === "other" || studentInfo?.batch === "Z") {
    totalMarks += formData.subjectMarks.mathematics.obtainedMark;
    totalMarks += formData.subjectMarks.biology.obtainedMark;

    maxMarks += formData.subjectMarks.mathematics.totalMark;
    maxMarks += formData.subjectMarks.biology.totalMark;
  }
  // Default → Math
  else {
    totalMarks += formData.subjectMarks.mathematics.obtainedMark;
    maxMarks += formData.subjectMarks.mathematics.totalMark;
  }

  const payload = {
    studentCode: formData.studentCode,
    testType: formData.testType,
    testDate: formData.testDate,
    name: studentInfo.name,
    fatherName: studentInfo.fatherName,
    batch: studentInfo.batch,
    subjectMarks: formData.subjectMarks,
    totalMarks, // sum of obtained marks
    maxMarks,   // sum of total marks
  };

  try {
    await axios.post(
      "https://result-analyserr.onrender.com/api/results",
      payload
    );
    alert("✅ Result Saved Successfully!");
    setFormData({
      testDate: "",
      studentCode: "",
      testType: "jeemains",
      subjectMarks: {
        physics: { totalMark: 0, correctMark: 0, incorrectMark: 0, obtainedMark: 0 },
        chemistry: { totalMark: 0, correctMark: 0, incorrectMark: 0, obtainedMark: 0 },
        biology: { totalMark: 0, correctMark: 0, incorrectMark: 0, obtainedMark: 0 },
        mathematics: { totalMark: 0, correctMark: 0, incorrectMark: 0, obtainedMark: 0 },
      },
      totalMarks: 0,
      maxMarks: 0,
    });
    setStudentInfo(null);
  } catch (err) {
    if (err.response?.status === 409) {
      alert("⚠️ Result already exists for this student, test type, and date.");
    } else {
      alert("❌ Something went wrong while saving.");
    }
  }
  setSubmitting(false);
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
        <div className="setresult-header">📖 STUDENT RESULT PORTAL</div>
        <div className="setdetails-card-content">
        <form
          id="student-form"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const form = e.target.form;
              const index = Array.prototype.indexOf.call(form, e.target);
              if (index > -1 && index + 1 < form.elements.length) {
                e.preventDefault();
                form.elements[index + 1].focus();
              }
            }
          }}
        >
          <div className="flex-row">
            <div className="form-group">
              <label className="label-text">Test Date</label>
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
              <label className="label-text" >Student Code</label>
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
              <label className="label-text">Test Pattern</label>
              <select
                name="testType"
                className="selectcl"
                onChange={handleChange}
                value={formData.testType}
              >
                <option value="jeemains">JEE Mains</option>
                <option value="jeemainsparttest">JEE Mains-Part Test</option>
                <option value="jeemainscumulativetest">JEE Mains-Cumulative Test</option>
                <option value="jeeadvanced">JEE Advanced</option>
                <option value="neet">NEET</option>
                <option value="neetparttest">NEET Part Test</option>
                <option value="neettough">NEET Tough</option>
                <option value="neetmoderate">NEET Moderate</option>
                <option value="topictest">Topic Test</option>
                <option value="quiztest">Quiz Test</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {loading && <p className="info-msg">Loading student details...</p>}

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
            <table className="marks-table">
              <thead>
                <tr>
                  <th>Subject</th>
                  {columns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["physics", "chemistry"].map((subject) => (
                  <tr key={subject}>
                    <td className="subject-name">{subject.toUpperCase()}</td>
                    {columns.map((col) => (
                      <td key={col.key}>
                        <input
                          type="number"
                          placeholder={col.label}
                          value={formData.subjectMarks[subject][col.key] || ""}
                          onChange={(e) =>
                            col.key !== "obtainedMark" &&
                            handleSubjectChange(subject, col.key, e.target.value)
                          }
                          className="marks-input"
                          min={0}
                          required={col.key !== "obtainedMark"}
                          readOnly={col.key === "obtainedMark"}
                        />
                      </td>
                    ))}
                  </tr>
                ))}

                {formData.testType === "neet" ||
                formData.testType === "neetparttest" ||
                formData.testType === "neettough" ||
                formData.testType === "neetmoderate" ? (
                  <tr>
                    <td className="subject-name">BIOLOGY</td>
                    {columns.map((col) => (
                      <td key={col.key}>
                        <input
                          type="number"
                          placeholder={col.label}
                          value={formData.subjectMarks.biology[col.key] || ""}
                          onChange={(e) =>
                            col.key !== "obtainedMark" &&
                            handleSubjectChange("biology", col.key, e.target.value)
                          }
                          className="marks-input"
                          min={0}
                          required={col.key !== "obtainedMark"}
                          readOnly={col.key === "obtainedMark"}
                        />
                      </td>
                    ))}
                  </tr>
                ) : formData.testType === "other" || studentInfo?.batch === "Z" ? (
                  ["mathematics", "biology"].map((subject) => (
                    <tr key={subject}>
                      <td className="subject-name">{subject.toUpperCase()}</td>
                      {columns.map((col) => (
                        <td key={col.key}>
                          <input
                            type="number"
                            placeholder={col.label}
                            value={formData.subjectMarks[subject][col.key] || ""}
                            onChange={(e) =>
                              col.key !== "obtainedMark" &&
                              handleSubjectChange(subject, col.key, e.target.value)
                            }
                            className="marks-input"
                            min={0}
                            required={col.key !== "obtainedMark"}
                            readOnly={col.key === "obtainedMark"}
                          />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="subject-name">MATHEMATICS</td>
                    {columns.map((col) => (
                      <td key={col.key}>
                        <input
                          type="number"
                          placeholder={col.label}
                          value={formData.subjectMarks.mathematics[col.key] || ""}
                          onChange={(e) =>
                            col.key !== "obtainedMark" &&
                            handleSubjectChange("mathematics", col.key, e.target.value)
                          }
                          className="marks-input"
                          min={0}
                          required={col.key !== "obtainedMark"}
                          readOnly={col.key === "obtainedMark"}
                        />
                      </td>
                    ))}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
                     {/* <div className="total-marks-display">
  <strong>Total Marks (Overall):</strong> {formData.totalMarks}
</div> */}
          <button className="Resultbutton" type="submit" disabled={submitting}>
            <span className="btn-text">
              {submitting ? "Saving..." : "Save Result"}
            </span>
            <span className="btn-icon">➤</span>
          </button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default SetDetails;
