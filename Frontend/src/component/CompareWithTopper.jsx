import React, { useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/CompareWithTopper.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const CompareWithTopper = () => {
  const [studentCode, setStudentCode] = useState("");
  const [batch, setBatch] = useState("");
  const [testType, setTestType] = useState("quiztest");
  const [testDate, setTestDate] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  let navigate =useNavigate();
  const fetchComparison = async () => {
    if (!studentCode || !batch || !testType || !testDate) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await axios.get("https://result-analyserr.onrender.com/api/compare-with-topper", {
        params: { studentCode, batch, testType, testDate },
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setResult(null);
      setError("Unable to fetch comparison.");
    }
    finally{
      setLoading(false); // Hide loader after fetching data
    }
  };

  const isNeetBatch = ["madhav", "dron", "nakul"].includes(batch.toLowerCase());
  const subjectName = isNeetBatch ? "Biology" : "Mathematics";

  return (
    <div className="compare-container">
      <h2>Compare with Topper</h2>
       <button className="over" onClick={()=>{navigate("/graphicalanalysis")}}>Overall Graphical Analysis</button>
      <input
        className="inputclass"
        placeholder="Student Code"
        value={studentCode}
        onChange={(e) => setStudentCode(e.target.value)}
      />

      <select className="selectclass" value={batch} onChange={(e) => setBatch(e.target.value)}>
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

      <select className="selectclass" value={testType} onChange={(e) => setTestType(e.target.value)}>
        <option value="quiztest">Quiz Test</option>
        <option value="topictest">Topic Test</option>
        <option value="neet">NEET</option>
        <option value="jeemains">JEE Mains</option>
        <option value="jeeadvanced">JEE Advanced</option>
      </select>

      <input
      className="inputclass"
        placeholder="Test Date"
        type="date"
        value={testDate}
        onChange={(e) => setTestDate(e.target.value)}
      />

      <button className="compare" onClick={fetchComparison}>Compare</button>

      {error && <p className="error-message">{error}</p>}
         {/* SHOW "Searching..." WHEN LOADING */}
         {loading && (
        <p style={{ textAlign: "center", marginTop: "20px", fontWeight: "bold" }}>
          comparing...
        </p>
      )}
      {result && (
        <>
          {/* <div className="rank-comparison">
            <h3>Rank Comparison</h3>
            <p>Student Rank: {result.student.rank}</p>
            <p>Topper Rank: 1</p>
          </div> */}
          <div className="chart-container">
            <Bar
              data={{
                labels: ["Physics", "Chemistry", subjectName, "Total"],
                datasets: [
                  {
                    label: result.student.name + " (You)",
                    data: [
                      result.student.subjectMarks?.physics?.totalMark ?? 0,
                      result.student.subjectMarks?.chemistry?.totalMark ?? 0,
                      (isNeetBatch
                        ? result.student.subjectMarks?.biology?.totalMark
                        : result.student.subjectMarks?.mathematics?.totalMark) ?? 0,
                      result.student.totalMarks ?? 0,
                    ],
                    backgroundColor: "#4caf50",
                  },
                  {
                    label: result.topper.name + " (Topper)",
                    data: [
                      result.topper.subjectMarks?.physics?.totalMark ?? 0,
                      result.topper.subjectMarks?.chemistry?.totalMark ?? 0,
                      (isNeetBatch
                        ? result.topper.subjectMarks?.biology?.totalMark
                        : result.topper.subjectMarks?.mathematics?.totalMark) ?? 0,
                      result.topper.totalMarks ?? 0,
                    ],
                    backgroundColor: "#f44336",
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: "top" },
                  title: { display: true, text: "Student vs Topper - Marks Comparison" },
                },
                scales: {
                  y: { beginAtZero: true },
                },
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CompareWithTopper;











 
// import React, { useState } from "react";
// import axios from "axios";
// import { Bar, Line } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// } from "chart.js";

// ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

// const CompareWithTopper = () => {
//   const [name, setName] = useState("");
//   const [batch, setBatch] = useState("");
//   const [testType, setTestType] = useState("");
//   const [data, setData] = useState([]);
//   const [error, setError] = useState("");

//   const fetchComparison = async () => {
//     try {
//       const response = await axios.get(`http://localhost:10000/api/compare?name=${name}&batch=${batch}&testType=${testType}`);
//       setData(response.data);
//       setError("");
//     } catch (err) {
//       setError(err.response?.data?.message || "Error fetching data");
//       setData([]);
//     }
//   };

//   const getSubjectWiseBarChart = () => {
//     if (data.length === 0) return null;

//     const latest = data[data.length - 1]; // Latest test
//     if (!latest.topper || !latest.student) return null;

//     const subjects = ["physics", "chemistry", "mathematics", "biology"];
//     const labels = [];
//     const topperScores = [];
//     const studentScores = [];

//     subjects.forEach((subj) => {
//       const topperMark = latest.topper.subjectMarks?.[subj]?.totalMark;
//       const studentMark = latest.student.subjectMarks?.[subj]?.totalMark;
//       if (topperMark != null || studentMark != null) {
//         labels.push(subj.charAt(0).toUpperCase() + subj.slice(1));
//         topperScores.push(topperMark ?? 0);
//         studentScores.push(studentMark ?? 0);
//       }
//     });

//     return (
//       <Bar
//         data={{
//           labels,
//           datasets: [
//             {
//               label: "Topper",
//               data: topperScores,
//               backgroundColor: "rgba(75, 192, 192, 0.6)"
//             },
//             {
//               label: "Student",
//               data: studentScores,
//               backgroundColor: "rgba(153, 102, 255, 0.6)"
//             }
//           ]
//         }}
//         options={{
//           responsive: true,
//           plugins: { legend: { position: "top" }, title: { display: true, text: "Subject-wise Marks Comparison (Latest Test)" } },
//           indexAxis: "y"
//         }}
//       />
//     );
//   };

//   const getRankLineChart = () => {
//     if (data.length === 0) return null;

//     const labels = data.map(d => d.testDate);
//     const studentRanks = data.map(d => d.studentRank || null);
//     const topperRanks = data.map(() => 1); // Always 1

//     return (
//       <Line
//         data={{
//           labels,
//           datasets: [
//             {
//               label: "Topper Rank",
//               data: topperRanks,
//               borderColor: "green",
//               tension: 0.2,
//               fill: false
//             },
//             {
//               label: "Student Rank",
//               data: studentRanks,
//               borderColor: "red",
//               tension: 0.2,
//               fill: false
//             }
//           ]
//         }}
//         options={{
//           responsive: true,
//           plugins: {
//             legend: { position: "top" },
//             title: { display: true, text: "Rank Comparison Over Time" }
//           },
//           scales: {
//             y: {
//               reverse: true,
//               title: { display: true, text: "Rank" },
//               ticks: { stepSize: 1 }
//             }
//           }
//         }}
//       />
//     );
//   };

//   return (
//     <div className="compare-container">
//       <h2>Compare with Topper</h2>
//       <input type="text" placeholder="Student Name" value={name} onChange={(e) => setName(e.target.value)} />
//       <input type="text" placeholder="Batch" value={batch} onChange={(e) => setBatch(e.target.value)} />
//       <select value={testType} onChange={(e) => setTestType(e.target.value)}>
//         <option value="">Select Test Type</option>
//         <option value="quiztest">Quiz Test</option>
//         <option value="topictest">Topic Test</option>
//         <option value="jeemains">JEE Mains</option>
//         <option value="jeeadvanced">JEE Advanced</option>
//         <option value="neet">NEET</option>
//       </select>
//       <button onClick={fetchComparison}>Compare</button>

//       {error && <p className="error-message">{error}</p>}

//       <div className="charts">
//         {getSubjectWiseBarChart()}
//         {getRankLineChart()}
//       </div>
//     </div>
//   );
// };

// export default CompareWithTopper;
