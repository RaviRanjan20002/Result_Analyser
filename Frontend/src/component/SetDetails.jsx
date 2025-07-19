// import React, { useState,useRef } from "react";
// import axios from "axios";
// import "../styles/SetDetails.css"; // Assuming you have a CSS file for styling
// const SetDetails = () => {
//   const [password, setPassword] = useState("");
//   const [isAuthorized, setIsAuthorized] = useState(false);
//   const passwordInputRef = useRef(null);
//   const handlePasswordSubmit = () => {
//     if (password === "654321") {
//         setIsAuthorized(true);
//         setTimeout(() => passwordInputRef.current?.focus(), 100);
//     } else {
//         alert("❌ Incorrect Password. Try Again.");
//     }
// };
//   const [formData, setFormData] = useState({
//     testDate: "",
//     name: "",
//     fatherName: "",
//     batch: "Arjun",
//     testType: "jeemains",
//     subjectMarks: {
//       physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//       chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//       biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//       mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//     },
//     totalMarks: 0,
//   });

//   const fetchStudentDetails = async (name) => {
//     if (name.length < 3) return;
//     try {
//       const response = await axios.get(`https://result-analyserr.onrender.com/api/students/${name}`);
//       setFormData((prevData) => ({
//         ...prevData,
//         fatherName: response.data.fatherName,
//         batch: response.data.batch,
//       }));
//     } catch (error) {
//       console.log("Student not found, allowing new entry.");
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));

//     if (name === "name") {
//       fetchStudentDetails(value);
//     }
//   };

//   const handleSubjectChange = (subject, field, value) => {
//     setFormData((prevData) => ({
//       ...prevData,
//       subjectMarks: {
//         ...prevData.subjectMarks,
//         [subject]: {
//           ...prevData.subjectMarks[subject],
//           [field]: Number(value),
//         },
//       },
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const totalMarks =
//       formData.subjectMarks.physics.totalMark +
//       formData.subjectMarks.chemistry.totalMark +
//       (formData.testType === "neet"
//         ? formData.subjectMarks.biology.totalMark
//         : formData.subjectMarks.mathematics.totalMark);

//     try {
//       await axios.post("https://result-analyserr.onrender.com/api/results", {
//         ...formData,
//         totalMarks,
//       });
//       alert("Result Saved!");
//     //       // ✅ Reset form fields after saving
//     setFormData({
//       testDate: "",
//       name: "",
//       fatherName: "",
//       batch: "Arjun",
//       testType: "jeemains",
//       subjectMarks: {
//         physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//         chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//         biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//         mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
//       },
//       totalMarks: 0,
//     });
//     // ✅ Reset form inputs visually (force update in case of UI issues)
//     document.getElementById("student-form").reset();
//     } catch (err) {
//       if (err.response?.status === 409) {
//         alert("⚠️ Result already exists for this student, test type, and date.");
//       } else {
//         console.error(err);
//         alert("Something went wrong while saving.");
//       }
//     }
//   };
//   if (!isAuthorized) {
//     return (
//         <div className="Setcontainer">
//             <h2>👁️Enter Password to Access</h2>
//             <input
//                 ref={passwordInputRef}
//                 type="password"
//                 placeholder="Enter Password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//             />
//             <button className="passwordbttn" onClick={handlePasswordSubmit}>Submit</button>
//         </div>
//     );
// }
//   return (
//     <div className="container">
//       <h2>Set Student Details</h2>
//       <form id="student-form" onSubmit={handleSubmit}>
//         <input type="date" name="testDate" onChange={handleChange} required />

//         <input
//           type="text"
//           name="name"
//           placeholder="Student Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="text"
//           name="fatherName"
//           placeholder="Father's Name"
//           value={formData.fatherName}
//           onChange={handleChange}
//           required
//         />

//         <select name="batch" onChange={handleChange} value={formData.batch}>
//           <option value="Arjun">Arjun</option>
//           <option value="Eklavya">Eklavya</option>
//           <option value="Bhism">Bhism</option>
//           <option value="Bheem">Bheem</option>
//           <option value="Madhav">Madhav</option>
//           <option value="Dron">Dron</option>
//           <option value="Nakul">Nakul</option>
//           <option value="Toppers">Toppers</option>
//         </select>

//         <select name="testType" onChange={handleChange} value={formData.testType}>
//           <option value="jeemains">JEE Mains</option>
//           <option value="jeeadvanced">JEE Advanced</option>
//           <option value="neet">NEET</option>
//           <option value="topictest">Topic Test</option>
//           <option value="quiztest">Quiz Test</option>
//         </select>

//         {/* Always show Physics & Chemistry */}
//         {["physics", "chemistry"].map((subject) => (
//           <div key={subject}>
//             <h4>{subject.toUpperCase()}</h4>
//             <input
//               type="number"
//               placeholder="Correct marks"
//               onChange={(e) => handleSubjectChange(subject, "correctMark", e.target.value)}
//               required
//             />
//             <input
//               type="number"
//               placeholder="Incorrect marks"
//               onChange={(e) => handleSubjectChange(subject, "incorrectMark", e.target.value)}
//               required
//             />
//             <input
//               type="number"
//               placeholder="Total Marks"
//               onChange={(e) => handleSubjectChange(subject, "totalMark", e.target.value)}
//               required
//             />
//           </div>
//         ))}

//         {/* Conditionally show Mathematics or Biology */}
//         {formData.testType === "neet" ? (
//           <div>
//             <h4>BIOLOGY</h4>
//             <input
//               type="number"
//               placeholder="Correct marks"
//               onChange={(e) => handleSubjectChange("biology", "correctMark", e.target.value)}
//               required
//             />
//             <input
//               type="number"
//               placeholder="Incorrect marks"
//               onChange={(e) => handleSubjectChange("biology", "incorrectMark", e.target.value)}
//               required
//             />
//             <input
//               type="number"
//               placeholder="Total Marks"
//               onChange={(e) => handleSubjectChange("biology", "totalMark", e.target.value)}
//               required
//             />
//           </div>
//         ) : (
//           <div>
//             <h4>MATHEMATICS</h4>
//             <input
//               type="number"
//               placeholder="Correct marks"
//               onChange={(e) => handleSubjectChange("mathematics", "correctMark", e.target.value)}
//               required
//             />
//             <input
//               type="number"
//               placeholder="Incorrect marks"
//               onChange={(e) => handleSubjectChange("mathematics", "incorrectMark", e.target.value)}
//               required
//             />
//             <input
//               type="number"
//               placeholder="Total Marks"
//               onChange={(e) => handleSubjectChange("mathematics", "totalMark", e.target.value)}
//               required
//             />
//           </div>
//         )}

//         <button type="submit">Save Details</button>
//       </form>
//     </div>
//   );
// };

// export default SetDetails;

import React, { useState, useRef } from "react";
import axios from "axios";
import "../styles/SetDetails.css";

const SetDetails = () => {
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

  const [formData, setFormData] = useState({
    testDate: "",
    name: "",
    fatherName: "",
    batch: "Arjun",
    testType: "jeemains",
    subjectMarks: {
      physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
      chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
      biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
      mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
    },
    totalMarks: 0,
  });

  const [fatherOptions, setFatherOptions] = useState([]);
  const [matchedStudents, setMatchedStudents] = useState([]);

  // const fetchStudentDetails = async (name) => {
  //   if (name.length < 3) return;
  //   try {
  //     const response = await axios.get(
  //       `https://result-analyserr.onrender.com/api/students/${name}`
  //     );
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       fatherName: response.data.fatherName,
  //       batch: response.data.batch,
  //     }));
  //   } catch (error) {
  //     console.log("Student not found, allowing new entry.");
  //   }
  // };

  // const fetchStudentDetails = async (name) => {
  //   if (name.length < 3) return;
  //   try {
  //     const response = await axios.get(
  //       `http://localhost:3001/api/students/${name}`
  //     );

  //     const fathers = response.data.fatherNames || [];

  //     if (fathers.length === 1) {
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         fatherName: fathers[0],
  //       }));
  //       setFatherOptions([]);
  //     } else if (fathers.length > 1) {
  //       setFatherOptions(fathers);
  //       setFormData((prevData) => ({
  //         ...prevData,
  //         fatherName: "",
  //       }));
  //     } else {
  //       setFatherOptions([]);
  //     }
  //   } catch (error) {
  //     console.log("Student not found, allowing manual entry.");
  //     setFatherOptions([]);
  //   }
  // };

  const fetchStudentDetails = async (name) => {
    if (name.length < 3) return;

    try {
      const response = await axios.get(
        `https://result-analyserr.onrender.com/api/students/${name}`
      );

      const students = response.data.students || [];

      if (students.length === 1) {
        // Single student, autofill both fatherName and batch
        setFormData((prevData) => ({
          ...prevData,
          fatherName: students[0].fatherName,
          batch: students[0].batch,
        }));
        setFatherOptions([]);
      } else if (students.length > 1) {
        // Multiple matches — show dropdown for fatherName
        const uniqueFathers = [...new Set(students.map((s) => s.fatherName))];
        setFatherOptions(uniqueFathers);
        setMatchedStudents(students);
        setFormData((prevData) => ({
          ...prevData,
          fatherName: "", // clear until selection
        }));
      } else {
        // No match
        setFatherOptions([]);
        setMatchedStudents([]);
      }
    } catch (error) {
      console.log("Student not found, allowing manual entry.");
      setFatherOptions([]);
      setMatchedStudents([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (name === "name") {
      fetchStudentDetails(value);
    }
  };

  const handleSubjectChange = (subject, field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      subjectMarks: {
        ...prevData.subjectMarks,
        [subject]: {
          ...prevData.subjectMarks[subject],
          [field]: Number(value) || 0,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const totalMarks =
    //   formData.subjectMarks.physics.totalMark +
    //   formData.subjectMarks.chemistry.totalMark +
    //   (formData.testType === "neet"
    //     ? formData.subjectMarks.biology.totalMark
    //     : formData.subjectMarks.mathematics.totalMark);
    const totalMarks =
      formData.subjectMarks.physics.totalMark +
      formData.subjectMarks.chemistry.totalMark +
      (formData.batch === "Z"
        ? formData.subjectMarks.mathematics.totalMark +
          formData.subjectMarks.biology.totalMark
        : formData.testType === "neet" ||
          ["Dron", "Madhav", "Nakul"].includes(formData.batch)
        ? formData.subjectMarks.biology.totalMark
        : formData.subjectMarks.mathematics.totalMark);

    const payload = {
      ...formData,
      // testDate: new Date(formData.testDate),
      testDate: formData.testDate, // 👈 keep it as is — it's already in YYYY-MM-DD format
      totalMarks,
    };

    try {
      await axios.post(
        "https://result-analyserr.onrender.com/api/results",
        payload
      );
      alert("✅ Result Saved Successfully!");

      // Proper state reset
      setFormData({
        testDate: "",
        name: "",
        fatherName: "",
        batch: "Arjun",
        testType: "jeemains",
        subjectMarks: {
          physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
          chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
          biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
          mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
        },
        totalMarks: 0,
      });
    } catch (err) {
      if (err.response?.status === 409) {
        alert(
          "⚠️ Result already exists for this student, test type, and date."
        );
      } else {
        console.error(err);
        alert("❌ Something went wrong while saving.");
      }
    }
  };

  if (!isAuthorized) {
    return (
      <div className="Setcontainer">
        <h2>👁️Enter Password to Access</h2>
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
    <div className="container">
      <h2>Set Student Details</h2>
      <form
        id="student-form"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const form = e.target.form;
            const index = Array.prototype.indexOf.call(form, e.target);

            // Move to next input if available
            if (index > -1 && index + 1 < form.elements.length) {
              e.preventDefault();
              form.elements[index + 1].focus();
            }
          }
        }}
      >
        <input
          type="date"
          className="inputcl"
          name="testDate"
          value={formData.testDate}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="name"
          className="inputcl"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        {/* <input
          type="text"
          name="fatherName"
          placeholder="Father's Name"
          className="inputcl"
          value={formData.fatherName}
          onChange={handleChange}
          required
        /> */}
        {/* 
{fatherOptions.length > 1 ? (
  <select
    name="fatherName"
    className="selectcl"
    value={formData.fatherName}
    onChange={handleChange}
    required
  >
    <option value="">Select Father's Name</option>
    {fatherOptions.map((father, idx) => (
      <option key={idx} value={father}>
        {father}
      </option>
    ))}
  </select>
) : (
  <input
    type="text"
    name="fatherName"
    placeholder="Father's Name"
    className="inputcl"
    value={formData.fatherName}
    onChange={handleChange}
    required
  />
)} */}
        {fatherOptions.length > 0 ? (
          <select
            name="fatherName"
            className="inputcl"
            value={formData.fatherName}
            onChange={(e) => {
              const selectedFather = e.target.value;
              const matched = matchedStudents.find(
                (s) => s.fatherName === selectedFather
              );
              setFormData((prevData) => ({
                ...prevData,
                fatherName: selectedFather,
                batch: matched?.batch || prevData.batch,
              }));
            }}
            required
          >
            <option value="">Select Father</option>
            {fatherOptions.map((father, idx) => (
              <option key={idx} value={father}>
                {father}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            name="fatherName"
            placeholder="Father's Name"
            className="inputcl"
            value={formData.fatherName}
            onChange={handleChange}
            required
          />
        )}

        <select
          className="selectcl"
          name="batch"
          onChange={handleChange}
          value={formData.batch}
        >
          <option value="Arjun">Arjun</option>
          <option value="Eklavya">Eklavya</option>
          <option value="Bhism">Bhism</option>
          <option value="Bheem">Bheem</option>
          <option value="Madhav">Madhav</option>
          <option value="Dron">Dron</option>
          <option value="Nakul">Nakul</option>
          <option value="Toppers">Toppers</option>
          <option value="Z">Z</option>
        </select>

        <select
          className="selectcl"
          name="testType"
          onChange={handleChange}
          value={formData.testType}
        >
          <option value="jeemains">JEE Mains</option>
          <option value="jeeadvanced">JEE Advanced</option>
          <option value="neet">NEET</option>
          <option value="topictest">Topic Test</option>
          <option value="quiztest">Quiz Test</option>
          <option value="other">Other</option>
        </select>

        {/* {["physics", "chemistry"].map((subject) => (
          <div key={subject}>
            <h4>{subject.toUpperCase()}</h4>
            <input
              type="number"
              placeholder="Correct marks"
              value={formData.subjectMarks[subject].correctMark}
              onChange={(e) =>
                handleSubjectChange(subject, "correctMark", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Incorrect marks"
              value={formData.subjectMarks[subject].incorrectMark}
              onChange={(e) =>
                handleSubjectChange(subject, "incorrectMark", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={formData.subjectMarks[subject].totalMark}
              onChange={(e) =>
                handleSubjectChange(subject, "totalMark", e.target.value)
              }
              required
            />
          </div>
        ))}

        {formData.testType === "neet" ||
        ["Dron", "Madhav", "Nakul"].includes(formData.batch) ? (
          <div>
            <h4>BIOLOGY</h4>
            <input
              type="number"
              placeholder="Correct marks"
              value={formData.subjectMarks.biology.correctMark}
              onChange={(e) =>
                handleSubjectChange("biology", "correctMark", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Incorrect marks"
              value={formData.subjectMarks.biology.incorrectMark}
              onChange={(e) =>
                handleSubjectChange("biology", "incorrectMark", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={formData.subjectMarks.biology.totalMark}
              onChange={(e) =>
                handleSubjectChange("biology", "totalMark", e.target.value)
              }
              required
            />
          </div>
        ) : (
          <div>
            <h4>MATHEMATICS</h4>
            <input
              type="number"
              placeholder="Correct marks"
              value={formData.subjectMarks.mathematics.correctMark}
              onChange={(e) =>
                handleSubjectChange(
                  "mathematics",
                  "correctMark",
                  e.target.value
                )
              }
              required
            />
            <input
              type="number"
              placeholder="Incorrect marks"
              value={formData.subjectMarks.mathematics.incorrectMark}
              onChange={(e) =>
                handleSubjectChange(
                  "mathematics",
                  "incorrectMark",
                  e.target.value
                )
              }
              required
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={formData.subjectMarks.mathematics.totalMark}
              onChange={(e) =>
                handleSubjectChange("mathematics", "totalMark", e.target.value)
              }
              required
            />
          </div>
        )} */}
        {["physics", "chemistry"].map((subject) => (
          <div key={subject}>
            <h4>{subject.toUpperCase()}</h4>
            <input
              type="number"
              placeholder="Correct marks"
              value={formData.subjectMarks[subject].correctMark}
              onChange={(e) =>
                handleSubjectChange(subject, "correctMark", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Incorrect marks"
              value={formData.subjectMarks[subject].incorrectMark}
              onChange={(e) =>
                handleSubjectChange(subject, "incorrectMark", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={formData.subjectMarks[subject].totalMark}
              onChange={(e) =>
                handleSubjectChange(subject, "totalMark", e.target.value)
              }
              required
            />
          </div>
        ))}

        {/* Show Biology AND Mathematics if batch is Z */}
        {formData.batch === "Z" ? (
          <>
            <div>
              <h4>BIOLOGY</h4>
              <input
                type="number"
                placeholder="Correct marks"
                value={formData.subjectMarks.biology.correctMark}
                onChange={(e) =>
                  handleSubjectChange("biology", "correctMark", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Incorrect marks"
                value={formData.subjectMarks.biology.incorrectMark}
                onChange={(e) =>
                  handleSubjectChange(
                    "biology",
                    "incorrectMark",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Total Marks"
                value={formData.subjectMarks.biology.totalMark}
                onChange={(e) =>
                  handleSubjectChange("biology", "totalMark", e.target.value)
                }
                required
              />
            </div>

            <div>
              <h4>MATHEMATICS</h4>
              <input
                type="number"
                placeholder="Correct marks"
                value={formData.subjectMarks.mathematics.correctMark}
                onChange={(e) =>
                  handleSubjectChange(
                    "mathematics",
                    "correctMark",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Incorrect marks"
                value={formData.subjectMarks.mathematics.incorrectMark}
                onChange={(e) =>
                  handleSubjectChange(
                    "mathematics",
                    "incorrectMark",
                    e.target.value
                  )
                }
                required
              />
              <input
                type="number"
                placeholder="Total Marks"
                value={formData.subjectMarks.mathematics.totalMark}
                onChange={(e) =>
                  handleSubjectChange(
                    "mathematics",
                    "totalMark",
                    e.target.value
                  )
                }
                required
              />
            </div>
          </>
        ) : formData.testType === "neet" ||
          ["Dron", "Madhav", "Nakul"].includes(formData.batch) ? (
          <div>
            <h4>BIOLOGY</h4>
            <input
              type="number"
              placeholder="Correct marks"
              value={formData.subjectMarks.biology.correctMark}
              onChange={(e) =>
                handleSubjectChange("biology", "correctMark", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Incorrect marks"
              value={formData.subjectMarks.biology.incorrectMark}
              onChange={(e) =>
                handleSubjectChange("biology", "incorrectMark", e.target.value)
              }
              required
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={formData.subjectMarks.biology.totalMark}
              onChange={(e) =>
                handleSubjectChange("biology", "totalMark", e.target.value)
              }
              required
            />
          </div>
        ) : (
          <div>
            <h4>MATHEMATICS</h4>
            <input
              type="number"
              placeholder="Correct marks"
              value={formData.subjectMarks.mathematics.correctMark}
              onChange={(e) =>
                handleSubjectChange(
                  "mathematics",
                  "correctMark",
                  e.target.value
                )
              }
              required
            />
            <input
              type="number"
              placeholder="Incorrect marks"
              value={formData.subjectMarks.mathematics.incorrectMark}
              onChange={(e) =>
                handleSubjectChange(
                  "mathematics",
                  "incorrectMark",
                  e.target.value
                )
              }
              required
            />
            <input
              type="number"
              placeholder="Total Marks"
              value={formData.subjectMarks.mathematics.totalMark}
              onChange={(e) =>
                handleSubjectChange("mathematics", "totalMark", e.target.value)
              }
              required
            />
          </div>
        )}

        <button className="passwordbttn" type="submit">
          Save Details
        </button>
      </form>
    </div>
  );
};

export default SetDetails;
