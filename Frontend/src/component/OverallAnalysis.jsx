import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const OverallAnalysis = () => {
  const [studentCode, setStudentCode] = useState("");
  const [batch, setBatch] = useState("");
  const [testType, setTestType] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});
  const [error, setError] = useState("");

  const isNeetBatch = ["dron", "madhav", "nakul"].includes(batch.toLowerCase());

  const fetchPerformance = async () => {
    if (!studentCode || !batch || !testType) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");

    try {
      const response = await axios.get("http://localhost:3001/api/student-performance", {
        params: { studentCode, batch, testType },
      });

      const sortedResults = response.data;

      const labels = sortedResults.map(item => item.testDate);

      const physicsMarks = sortedResults.map(item => parseFloat(item.physics));
      const chemistryMarks = sortedResults.map(item => parseFloat(item.chemistry));
      const thirdSubjectMarks = sortedResults.map(item => parseFloat(item.third));
      const totalMarks = sortedResults.map(item => parseFloat(item.total));

      // Get highest value for dynamic Y-axis
      const allValues = [...physicsMarks, ...chemistryMarks, ...thirdSubjectMarks, ...totalMarks];
      const highestValue = Math.max(...allValues);
      const dynamicMax = Math.ceil(highestValue / 10) * 10 + 10; // round up to next 10 + buffer

      setChartData({
        labels,
        datasets: [
          {
            label: "Physics (%)",
            data: physicsMarks,
            borderColor: "#2196F3",
            backgroundColor: "rgba(33, 150, 243, 0.2)",
            tension: 0.5,
          },
          {
            label: "Chemistry (%)",
            data: chemistryMarks,
            borderColor: "#FF9800",
            backgroundColor: "rgba(255, 152, 0, 0.2)",
            tension: 0.5,
          },
          {
            label: isNeetBatch ? "Biology (%)" : "Mathematics (%)",
            data: thirdSubjectMarks,
            borderColor: "#9C27B0",
            backgroundColor: "rgba(156, 39, 176, 0.2)",
            tension: 0.5,
          },
          {
            label: "Total Marks (%)",
            data: totalMarks,
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.2)",
            borderDash: [5, 5],
            tension: 0.5,
          },
        ],
      });

      // Chart options
      setChartOptions({
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Relative Performance (%) :(Student marks/Highest marks) * 100",
          },
          tooltip: {
            callbacks: {
              label: (context) => `${context.dataset.label}: ${context.raw}%`,
            },
          },
        },
        scales: {
          y: {
            min: 0,
            max: dynamicMax,
            title: {
              display: true,
              text: "Performance (%)",
            },
          },
        },
      });

    } catch (err) {
      console.error(err);
      setError("Failed to fetch performance data.");
      setChartData(null);
    }
  };

  return (
    <div className="chart-container">
      <h2>Student Performance Overview</h2>

      <div className="form-group">
        <input
          type="text"
          placeholder="Student Code"
          value={studentCode}
          onChange={(e) => setStudentCode(e.target.value)}
        />
        <select value={batch} onChange={(e) => setBatch(e.target.value)}>
          <option value="">Select Your Batch</option>
          <option value="Arjun">Arjun</option>
          <option value="Eklavya">Eklavya</option>
          <option value="Bhism">Bhism</option>
          <option value="Bheem">Bheem</option>
          <option value="Madhav">Madhav</option>
          <option value="Dron">Dron</option>
          <option value="Nakul">Nakul</option>
          <option value="Toppers">Toppers</option>
        </select>
        <select value={testType} onChange={(e) => setTestType(e.target.value)}>
          <option value="">Select Test Type</option>
          <option value="jeemains">JEE Mains</option>
          <option value="jeeadvanced">JEE Advanced</option>
          <option value="neet">NEET</option>
          <option value="topictest">Topic Test</option>
          <option value="quiztest">Quiz Test</option>
        </select>
        <button onClick={fetchPerformance}>Submit</button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {chartData && (
        <div className="line-chart">
          <Line data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
};

export default OverallAnalysis;


























// import React, { useState, useRef } from "react";
// import axios from "axios";
// import { Line } from "react-chartjs-2";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const OverallAnalysis = () => {
//   const [studentCode, setStudentCode] = useState("");
//   const [batch, setBatch] = useState("");
//   const [testType, setTestType] = useState("");
//   const [chartData, setChartData] = useState(null);
//   const [chartOptions, setChartOptions] = useState({});
//   const [error, setError] = useState("");

//   const chartRef = useRef(null);

//   const isNeetBatch = ["dron", "madhav", "nakul"].includes(batch.toLowerCase());

//   const fetchPerformance = async () => {
//     if (!studentCode || !batch || !testType) {
//       setError("Please fill in all fields.");
//       return;
//     }

//     setError("");

//     try {
//       const response = await axios.get("http://localhost:3001/api/student-performance", {
//         params: { studentCode, batch, testType },
//       });

//       const sortedResults = response.data;

//       const labels = sortedResults.map(item => item.testDate);

//       const physicsMarks = sortedResults.map(item => parseFloat(item.physics));
//       const chemistryMarks = sortedResults.map(item => parseFloat(item.chemistry));
//       const thirdSubjectMarks = sortedResults.map(item => parseFloat(item.third));
//       const totalMarks = sortedResults.map(item => parseFloat(item.total));

//       const allValues = [...physicsMarks, ...chemistryMarks, ...thirdSubjectMarks, ...totalMarks];
//       const highestValue = Math.max(...allValues);
//       const dynamicMax = Math.ceil(highestValue / 10) * 10 + 10;

//       setChartData({
//         labels,
//         datasets: [
//           {
//             label: "Physics (%)",
//             data: physicsMarks,
//             borderColor: "#2196F3",
//             backgroundColor: "rgba(33, 150, 243, 0.2)",
//             tension: 0.5,
//           },
//           {
//             label: "Chemistry (%)",
//             data: chemistryMarks,
//             borderColor: "#FF9800",
//             backgroundColor: "rgba(255, 152, 0, 0.2)",
//             tension: 0.5,
//           },
//           {
//             label: isNeetBatch ? "Biology (%)" : "Mathematics (%)",
//             data: thirdSubjectMarks,
//             borderColor: "#9C27B0",
//             backgroundColor: "rgba(156, 39, 176, 0.2)",
//             tension: 0.5,
//           },
//           {
//             label: "Total Marks (%)",
//             data: totalMarks,
//             borderColor: "#4CAF50",
//             backgroundColor: "rgba(76, 175, 80, 0.2)",
//             borderDash: [5, 5],
//             tension: 0.5,
//           },
//         ],
//       });

//       setChartOptions({
//         responsive: true,
//         plugins: {
//           title: {
//             display: true,
//             text: "Relative Performance (%)",
//           },
//           tooltip: {
//             callbacks: {
//               label: (context) => `${context.dataset.label}: ${context.raw}%`,
//             },
//           },
//         },
//         scales: {
//           y: {
//             min: 0,
//             max: dynamicMax,
//             title: {
//               display: true,
//               text: "Performance (%)",
//             },
//           },
//         },
//       });

//     } catch (err) {
//       console.error(err);
//       setError("Failed to fetch performance data.");
//       setChartData(null);
//     }
//   };

//   const handleDownloadPDF = async () => {
//     if (!chartRef.current) return;

//     const canvas = await html2canvas(chartRef.current);
//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF({
//       orientation: "landscape",
//       unit: "px",
//       format: [canvas.width, canvas.height],
//     });

//     pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
//     pdf.save(`performance-${studentCode}.pdf`);
//   };

//   return (
//     <div className="chart-container">
//       <h2>Student Performance Overview</h2>

//       <div className="form-group">
//         <input
//           type="text"
//           placeholder="Student Code"
//           value={studentCode}
//           onChange={(e) => setStudentCode(e.target.value)}
//         />
//         <select value={batch} onChange={(e) => setBatch(e.target.value)}>
//           <option value="">Select Your Batch</option>
//           <option value="Arjun">Arjun</option>
//           <option value="Eklavya">Eklavya</option>
//           <option value="Bhism">Bhism</option>
//           <option value="Bheem">Bheem</option>
//           <option value="Madhav">Madhav</option>
//           <option value="Dron">Dron</option>
//           <option value="Nakul">Nakul</option>
//           <option value="Toppers">Toppers</option>
//         </select>
//         <select value={testType} onChange={(e) => setTestType(e.target.value)}>
//           <option value="">Select Test Type</option>
//           <option value="jeemains">JEE Mains</option>
//           <option value="jeeadvanced">JEE Advanced</option>
//           <option value="neet">NEET</option>
//           <option value="topictest">Topic Test</option>
//           <option value="quiztest">Quiz Test</option>
//         </select>
//         <button onClick={fetchPerformance}>Submit</button>
//       </div>

//       {error && <p className="error-message">{error}</p>}

//       {chartData && (
//         <>
//           <div className="line-chart" ref={chartRef}>
//             <Line data={chartData} options={chartOptions} />
//           </div>
//           <button onClick={handleDownloadPDF} style={{ marginTop: "10px" }}>
//             Download Chart as PDF
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default OverallAnalysis;