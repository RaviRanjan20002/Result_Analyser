
// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// PS D:\TestPlatform\backend> c
// >> 
//   TCP    0.0.0.0:5000           0.0.0.0:0              LISTENING       25512
//   TCP    [::]:5000              [::]:0                 LISTENING       25512
// PS D:\TestPlatform\backend> netstat -ano | findstr :5000
// taskkill /PID 23996 /F

// SUCCESS: The process with PID 25512 has been terminated.
// PS D:\TestPlatform\backend> npm start



const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("MongoDB Connection Error:", err));
// Define Mongoose Schema
const resultSchema = new mongoose.Schema({
  testDate: String,
  name: String,
  fatherName: String,
  batch: String,
  testType: String,
  studentCode: String,
  subjectMarks: {
    physics: { correctMark: Number, incorrectMark: Number, totalMark: Number },
    chemistry: { correctMark: Number, incorrectMark: Number, totalMark: Number },
    biology: { correctMark: Number, incorrectMark: Number, totalMark: Number },
    mathematics: { correctMark: Number, incorrectMark: Number, totalMark: Number },
  },
  totalMarks: Number,
});

const Result = mongoose.model("Result", resultSchema);
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// ✅ API to Add Student Test Details
app.post("/api/results", async (req, res) => {
  try {
    const { name, fatherName, testType, subjectMarks } = req.body;
    let totalMarks = 0;

    // Calculate total marks
    if (testType === "neet") {
      totalMarks = subjectMarks.physics.totalMark + subjectMarks.chemistry.totalMark + subjectMarks.biology.totalMark;
    } else {
      totalMarks = subjectMarks.physics.totalMark + subjectMarks.chemistry.totalMark + subjectMarks.mathematics.totalMark;
    }

    // ✅ Check if student exists
    const existing = await Result.findOne({ name, fatherName });
    let studentCode = existing?.studentCode;

    // ✅ Generate 5-digit code if not already assigned
    if (!studentCode) {
      studentCode = Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Save result
    const result = new Result({
      ...req.body,
      subjectMarks: testType === "neet"
        ? {
            physics: subjectMarks.physics,
            chemistry: subjectMarks.chemistry,
            biology: subjectMarks.biology,
          }
        : {
            physics: subjectMarks.physics,
            chemistry: subjectMarks.chemistry,
            mathematics: subjectMarks.mathematics,
          },
      totalMarks,
      studentCode, // 🔐 assign code
    });

    await result.save();
    res.status(201).json({ message: "Result saved successfully!", studentCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/resultbycode", async (req, res) => {
  try {
    const { studentCode } = req.query;

    if (!studentCode || studentCode.length !== 5) {
      return res.status(400).json({ message: "Please provide a valid 5-digit student code." });
    }

    const results = await Result.find({ studentCode }).sort({ testDate: -1 });

    if (results.length === 0) {
      return res.status(404).json({ message: "No results found for this code." });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching result by code:", err);
    res.status(500).json({ error: "Internal server error." });
  }
});


// ✅ API to Fetch Test Details by Student Name
app.get("/api/results/:name", async (req, res) => {
  try {
    const results = await Result.find({ name: req.params.name });
    if (results.length === 0) {
      return res.status(404).json({ message: "No records found for this student." });
    }
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ API to Fetch Results by Batch
// ✅ API to Fetch Test Details by Batch Name
// ✅ API to Fetch Test Details by Batch Name
// app.get("/api/results/batch/:batch", async (req, res) => {
//   try {
//     console.log(`Fetching results for batch: ${req.params.batch}`);

//     const results = await Result.find({
//       batch: { $regex: new RegExp("^" + req.params.batch + "$", "i") },
//     });

//     if (results.length === 0) {
//       return res.status(404).json({ message: "No results found for this batch." });
//     }

//     res.status(200).json(results);
//   } catch (err) {
//     console.error("Error fetching batch results:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/api/results/batch/:batch", async (req, res) => {
//   try {
//     const { batch } = req.params;
//     const { testType } = req.query; // Get testType from query params

//     console.log(`Fetching results for batch: ${batch}, Test Type: ${testType}`);

//     const query = { batch };
//     if (testType) {
//       query.testType = testType; // Add testType filter
//     }

//     const results = await Result.find(query);

//     if (results.length === 0) {
//       return res.status(404).json({ message: "No results found for this batch and test type." });
//     }

//     res.status(200).json(results);
//   } catch (err) {
//     console.error("Error fetching batch results:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// app.get("/api/results/batch/:batch", async (req, res) => {
//   try {
//     const { batch } = req.params;
//     const { testType, filter } = req.query;

//     console.log(`Fetching results for batch: ${batch}, Test Type: ${testType}, Filter: ${filter}`);

//     const query = { batch };
//     if (testType) query.testType = testType;

//     let results = await Result.find(query).sort({ testDate: -1 });

//     if (testType === "quiztest") {
//       if (filter === "above75") {
//         results = results.filter(result => result.totalMarks > 225);
//       } else if (filter === "below75") {
//         results = results.filter(result => result.totalMarks <= 225);
//       } else if (filter === "above75Last3" || filter === "below75Last3") {
//         // Step 1: Group all quiztest results by student name
//         const studentMap = new Map();

//         results.forEach(result => {
//           if (!studentMap.has(result.name)) {
//             studentMap.set(result.name, []);
//           }
//           studentMap.get(result.name).push(result);
//         });

//         const filtered = [];

//         for (const [name, studentResults] of studentMap.entries()) {
//           const last3 = studentResults.slice(0, 3); // last 3 quiz tests

//           if (last3.length === 3) {
//             const allAbove = last3.every(r => r.totalMarks > 225);
//             const allBelow = last3.every(r => r.totalMarks <= 225);

//             if (filter === "above75Last3" && allAbove) {
//               filtered.push(last3[0]); // Include most recent one
//             }

//             if (filter === "below75Last3" && allBelow) {
//               filtered.push(last3[0]);
//             }
//           }
//         }

//         results = filtered;
//       }
//     }

//     if (results.length === 0) {
//       return res.status(404).json({ message: "No results found." });
//     }

//     res.status(200).json(results);
//   } catch (err) {
//     console.error("Error fetching results:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

app.get("/api/results/batch/:batch", async (req, res) => {
  try {
    const { batch } = req.params;
    const { testType, testDate } = req.query;

    console.log(`Fetching results for batch: ${batch}, Test Type: ${testType}, Test Date: ${testDate}`);

    const query = { batch };
    if (testType) query.testType = testType;
    if (testDate) query.testDate = testDate;

    const results = await Result.find(query).sort({ testDate: -1 });

    if (results.length === 0) {
      return res.status(404).json({ message: "This test type is not conducted on this date. Enter correct date." });
    }

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ error: err.message });
  }
});
// GET quiz performance results with filtering
app.get("/api/quiz-performance/:batch", async (req, res) => {
  try {
    const { batch } = req.params;
    const { filter, maxMarks } = req.query;

    if (!maxMarks) {
      return res.status(400).json({ message: "Max marks is required." });
    }

    const max = parseFloat(maxMarks);
    const threshold = 0.75 * max;

    const results = await Result.find({ batch, testType: "quiztest" }).sort({ testDate: -1 });

    let filteredResults = results;

    if (filter === "above75") {
      filteredResults = results.filter(result => result.totalMarks > threshold);
    } else if (filter === "below75") {
      filteredResults = results.filter(result => result.totalMarks <= threshold);
    } else if (filter === "above75Last3" || filter === "below75Last3") {
      const studentMap = new Map();

      results.forEach(result => {
        if (!studentMap.has(result.name)) {
          studentMap.set(result.name, []);
        }
        studentMap.get(result.name).push(result);
      });

      const filtered = [];

      for (const [name, studentResults] of studentMap.entries()) {
        const last3 = studentResults.slice(0, 3);

        if (last3.length === 3) {
          const allAbove = last3.every(r => r.totalMarks > threshold);
          const allBelow = last3.every(r => r.totalMarks <= threshold);

          if (filter === "above75Last3" && allAbove) {
            filtered.push(last3[0]);
          }

          if (filter === "below75Last3" && allBelow) {
            filtered.push(last3[0]);
          }
        }
      }

      filteredResults = filtered;
    }

    res.status(200).json(filteredResults);
  } catch (err) {
    console.error("Error in quiz performance:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ API to Fetch Unique Students (For Auto-Fill Feature)
app.get("/api/students", async (req, res) => {
  try {
    const students = await Result.find().select("name fatherName batch -_id").lean();
    const uniqueStudents = Object.values(
      students.reduce((acc, student) => {
        acc[student.name] = student;
        return acc;
      }, {})
    );
    res.status(200).json(uniqueStudents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/compare-with-topper", async (req, res) => {
  try {
    const { studentCode, batch, testType, testDate } = req.query;

    if (!studentCode || !batch || !testType || !testDate) {
      return res.status(400).json({ message: "Missing required parameters." });
    }

    const allResults = await Result.find({ batch, testType, testDate });

    if (!allResults.length) {
      return res.status(404).json({ message: "No results found for the provided test." });
    }

    // Sort by totalMarks descending
    const sorted = allResults.sort((a, b) => b.totalMarks - a.totalMarks);

    // Find student and topper
    const studentIndex = sorted.findIndex(r => r.studentCode === studentCode);
    const student = sorted[studentIndex];
    const topper = sorted[0];

    if (!student) {
      return res.status(404).json({ message: "Student not found in this test." });
    }

    const studentWithRank = { ...student.toObject(), rank: studentIndex + 1 };
    const topperWithRank = { ...topper.toObject(), rank: 1 };

    res.json({ student: studentWithRank, topper: topperWithRank });
  } catch (err) {
    console.error("Error comparing results:", err);
    res.status(500).json({ error: err.message });
  }
});




// Add this route in your Express app
// app.get("/api/compare", async (req, res) => {
//   try {
//     const { name, batch, testType } = req.query;

//     if (!name || !batch || !testType) {
//       return res.status(400).json({ message: "Please provide name, batch, and testType." });
//     }

//     const allResults = await Result.find({ batch, testType });

//     const studentResults = allResults.filter(r => r.name === name);
//     if (studentResults.length === 0) {
//       return res.status(404).json({ message: "No results found for the student." });
//     }

//     const testDates = [...new Set(allResults.map(r => r.testDate))].sort();

//     const rankedData = testDates.map(date => {
//       const resultsOnDate = allResults.filter(r => r.testDate === date);
//       const sorted = [...resultsOnDate].sort((a, b) => b.totalMarks - a.totalMarks);
//       const topper = sorted[0];
//       const student = sorted.find(r => r.name === name);

//       return {
//         testDate: date,
//         topper,
//         student,
//         topperRank: 1,
//         studentRank: student ? sorted.findIndex(r => r.name === student.name) + 1 : null
//       };
//     });

//     res.status(200).json(rankedData);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// ✅ API to Fetch Student Details by Name
app.get("/api/students/:name", async (req, res) => {
  try {
    const student = await Result.findOne({ name: req.params.name }).select("fatherName batch -_id");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

