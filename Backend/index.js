
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
//batch schema

const batchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
}, { timestamps: true });

const Batch = mongoose.model('Batch', batchSchema);

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
//for adding batch

 
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Get all batches
app.get("/api/batches", async (req, res) => {
  try {
    const batches = await Batch.find().sort({ name: 1 });
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: "Error fetching batches", error: error.message });
  }
});
// Get unique students by batch
app.get("/api/studentsByBatch/:batch", async (req, res) => {
  try {
    const { batch } = req.params;

    const students = await Result.aggregate([
      { $match: { batch } },
      {
        $group: {
          _id: {
            name: "$name",
            fatherName: "$fatherName",
            studentCode: "$studentCode",
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: "$_id.name",
          fatherName: "$_id.fatherName",
          studentCode: "$_id.studentCode",
        },
      },
      { $sort: { name: 1 } },
    ]);

    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.post("/api/batches/add", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Batch name required" });
    const existing = await Batch.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existing) return res.status(409).json({ message: "Batch already exists" });
    const batch = new Batch({ name });
    await batch.save();
    res.status(201).json({ message: "Batch added successfully", batch });
  } catch (error) {
    res.status(500).json({ message: "Error adding batch", error: error.message });
  }
});
// // ✅ API to Add Student Test Details
// app.post("/api/results", async (req, res) => {
//   try {
//     const { name, fatherName, testType, subjectMarks } = req.body;
//     let totalMarks = 0;

//     // Calculate total marks
//     if (testType === "neet") {
//       totalMarks = subjectMarks.physics.totalMark + subjectMarks.chemistry.totalMark + subjectMarks.biology.totalMark;
//     } else {
//       totalMarks = subjectMarks.physics.totalMark + subjectMarks.chemistry.totalMark + subjectMarks.mathematics.totalMark;
//     }

//     // ✅ Check if student exists
//     const existing = await Result.findOne({ name, fatherName });
//     let studentCode = existing?.studentCode;

//     // ✅ Generate 5-digit code if not already assigned
//     if (!studentCode) {
//       studentCode = Math.floor(10000 + Math.random() * 90000).toString();
//     }

//     // Save result
//     const result = new Result({
//       ...req.body,
//       subjectMarks: testType === "neet"
//         ? {
//             physics: subjectMarks.physics,
//             chemistry: subjectMarks.chemistry,
//             biology: subjectMarks.biology,
//           }
//         : {
//             physics: subjectMarks.physics,
//             chemistry: subjectMarks.chemistry,
//             mathematics: subjectMarks.mathematics,
//           },
//       totalMarks,
//       studentCode, // 🔐 assign code
//     });

//     await result.save();
//     res.status(201).json({ message: "Result saved successfully!", studentCode });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });


//my previous code
// app.post("/api/results", async (req, res) => {
//   try {
//     const { name, fatherName, testType, testDate, subjectMarks, batch } = req.body;

//     // Convert to YYYY-MM-DD format string
//     // const testDateFormatted = new Date(testDate).toISOString().split("T")[0];
//     const testDateFormatted = testDate; // already in correct format

//     let totalMarks = 0;

//     // Calculate total marks
//     if (["dron", "madhav", "nakul"].includes(batch.toLowerCase())) {
//       totalMarks =
//         subjectMarks.physics.totalMark +
//         subjectMarks.chemistry.totalMark +
//         subjectMarks.biology.totalMark;
//     } else {
//       totalMarks =
//         subjectMarks.physics.totalMark +
//         subjectMarks.chemistry.totalMark +
//         subjectMarks.mathematics.totalMark;
//     }

//     // Check for duplicate entry
//     const duplicate = await Result.findOne({
//       name,
//       fatherName,
//       testType,
//       testDate: testDateFormatted,
//     });

//     if (duplicate) {
//       return res.status(409).json({ message: "⚠️ Result already exists for this test." });
//     }

//     // Reuse studentCode if exists
//     const existing = await Result.findOne({ name, fatherName });
//     let studentCode = existing?.studentCode;

//     if (!studentCode) {
//       studentCode = Math.floor(10000 + Math.random() * 90000).toString();
//     }

//     const result = new Result({
//       name,
//       fatherName,
//       batch,
//       testType,
//       testDate: testDateFormatted, // ✅ Properly formatted date
//       subjectMarks:
//       ["dron", "madhav", "nakul"].includes(batch.toLowerCase())
//           ? {
//               physics: subjectMarks.physics,
//               chemistry: subjectMarks.chemistry,
//               biology: subjectMarks.biology,
//             }
//           : {
//               physics: subjectMarks.physics,
//               chemistry: subjectMarks.chemistry,
//               mathematics: subjectMarks.mathematics,
//             },
//       totalMarks,
//       studentCode,
//     });

//     await result.save();
//     res.status(201).json({ message: "✅ Result saved successfully!", studentCode });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
app.post("/api/results", async (req, res) => {
  try {
    let { name, fatherName, testType, testDate, subjectMarks, batch } = req.body;

    // Normalize for matching
    const normalizedName = name.trim().toLowerCase();
    const normalizedFatherName = fatherName.trim().toLowerCase();

    // Format for storing (capitalize first letter of each word)
    const formattedName = toTitleCase(name.trim());
    const formattedFatherName = toTitleCase(fatherName.trim());

    const testDateFormatted = testDate; // already in correct format

    // let totalMarks = 0;

    // // Calculate total marks
    // if (["dron", "madhav", "nakul"].includes(batch.toLowerCase())) {
    //   totalMarks =
    //     subjectMarks.physics.totalMark +
    //     subjectMarks.chemistry.totalMark +
    //     subjectMarks.biology.totalMark;
    // } else {
    //   totalMarks =
    //     subjectMarks.physics.totalMark +
    //     subjectMarks.chemistry.totalMark +
    //     subjectMarks.mathematics.totalMark;
    // }
let totalMarks = 0;

if (["dron", "madhav", "nakul"].includes(batch.toLowerCase())) {
  totalMarks =
    subjectMarks.physics.totalMark +
    subjectMarks.chemistry.totalMark +
    subjectMarks.biology.totalMark;
} else if (batch.toLowerCase() === "z") {
  totalMarks =
    subjectMarks.physics.totalMark +
    subjectMarks.chemistry.totalMark +
    subjectMarks.mathematics.totalMark +
    subjectMarks.biology.totalMark;
} else {
  totalMarks =
    subjectMarks.physics.totalMark +
    subjectMarks.chemistry.totalMark +
    subjectMarks.mathematics.totalMark;
}

    // Case-insensitive duplicate check
    const duplicate = await Result.findOne({
      name: { $regex: `^${normalizedName}$`, $options: 'i' },
      fatherName: { $regex: `^${normalizedFatherName}$`, $options: 'i' },
      testType,
      testDate: testDateFormatted,
    });

    if (duplicate) {
      return res.status(409).json({ message: "⚠️ Result already exists for this test." });
    }

    // Reuse studentCode if student exists (case-insensitive)
    const existing = await Result.findOne({
      name: { $regex: `^${normalizedName}$`, $options: 'i' },
      fatherName: { $regex: `^${normalizedFatherName}$`, $options: 'i' },
    });

    let studentCode = existing?.studentCode;

    if (!studentCode) {
      studentCode = Math.floor(10000 + Math.random() * 90000).toString();
    }

    // Create new result
    const result = new Result({
      name: formattedName,
      fatherName: formattedFatherName,
      batch,
      testType,
      testDate: testDateFormatted,
      // subjectMarks:
      //   ["dron", "madhav", "nakul"].includes(batch.toLowerCase())
      //     ? {
      //         physics: subjectMarks.physics,
      //         chemistry: subjectMarks.chemistry,
      //         biology: subjectMarks.biology,
      //       }
      //     : {
      //         physics: subjectMarks.physics,
      //         chemistry: subjectMarks.chemistry,
      //         mathematics: subjectMarks.mathematics,
      //       },
      subjectMarks:
  ["dron", "madhav", "nakul"].includes(batch.toLowerCase())
    ? {
        physics: subjectMarks.physics,
        chemistry: subjectMarks.chemistry,
        biology: subjectMarks.biology,
      }
    : batch.toLowerCase() === "z"
    ? {
        physics: subjectMarks.physics,
        chemistry: subjectMarks.chemistry,
        mathematics: subjectMarks.mathematics,
        biology: subjectMarks.biology,
      }
    : {
        physics: subjectMarks.physics,
        chemistry: subjectMarks.chemistry,
        mathematics: subjectMarks.mathematics,
      },
      totalMarks,
      studentCode,
    });

    await result.save();
    res.status(201).json({ message: "✅ Result saved successfully!", studentCode });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: Capitalize first letter of each word
function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

app.post("/api/generate-code", async (req, res) => {
  try {
    const { name, fatherName, batch, testDate } = req.body;

    if (!name || !fatherName || !batch || !testDate) {
      return res.status(400).json({ message: "❌ All fields are required." });
    }

    const normalizedName = name.trim().toLowerCase();
    const normalizedFatherName = fatherName.trim().toLowerCase();

    const formattedName = toTitleCase(name.trim());
    const formattedFatherName = toTitleCase(fatherName.trim());

    // Check if a student code already exists
    const existing = await Result.findOne({
      name: { $regex: `^${normalizedName}$`, $options: "i" },
      fatherName: { $regex: `^${normalizedFatherName}$`, $options: "i" },
    });

    let studentCode = existing?.studentCode;

    if (!studentCode) {
      studentCode = Math.floor(10000 + Math.random() * 90000).toString();

      // Save minimal info into Result model just to store code (no marks yet)
      const result = new Result({
        name: formattedName,
        fatherName: formattedFatherName,
        batch,
        testDate,
        studentCode,
        subjectMarks: {},
        totalMarks: 0,
        testType: "", // can be filled later
      });

      await result.save();
    }

    return res.status(201).json({ studentCode, name: formattedName, fatherName: formattedFatherName, batch, testDate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}



// app.get("/api/resultbycode", async (req, res) => {
//   try {
//     const { studentCode } = req.query;

//     if (!studentCode || studentCode.length !== 5) {
//       return res.status(400).json({ message: "Please provide a valid 5-digit student code." });
//     }

//     const results = await Result.find({ studentCode }).sort({ testDate: -1 });

//     if (results.length === 0) {
//       return res.status(404).json({ message: "No results found for this code." });
//     }

//     res.status(200).json(results);
//   } catch (err) {
//     console.error("Error fetching result by code:", err);
//     res.status(500).json({ error: "Internal server error." });
//   }
// });



// GET student by studentCode
app.get('/api/studentByCode/:code', async (req, res) => {
  const studentCode = req.params.code;

  try {
    const student = await Result.findOne({ studentCode });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({
      name: student.name,
      fatherName: student.fatherName,
      batch: student.batch,
    });
  } catch (err) {
    console.error("Error fetching student by code:", err);
    res.status(500).json({ message: "Server error" });
  }
});
app.get('/api/studentCodes/by-date', async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ message: "Date is required" });

    const results = await Result.find({ testDate: date }).select('name fatherName batch studentCode testDate');

    if (!results.length) return res.status(404).json({ message: "No results found for this date" });

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: "Error fetching student codes for date", error: error.message });
  }
});

app.get("/api/resultbycode", async (req, res) => {
  try {
    const { studentCode } = req.query;

    if (!studentCode || studentCode.length !== 5) {
      return res
        .status(400)
        .json({ message: "Please provide a valid 5-digit student code." });
    }

    const studentResults = await Result.find({ studentCode }).sort({ testDate: -1 });

    if (studentResults.length === 0) {
      return res.status(404).json({ message: "No results found for this code." });
    }

    const resultsWithRank = await Promise.all(
      studentResults.map(async (studentResult) => {
        const { batch, testType, testDate } = studentResult;

        // Fetch all results for same test
        const sameTestResults = await Result.find({
          batch,
          testType,
          testDate,
        });

        // Sort them by totalMarks descending
        sameTestResults.sort((a, b) => (b.totalMarks || 0) - (a.totalMarks || 0));

        // Assign ranks
        const rankMap = {};
        let rankCounter = 1;
        sameTestResults.forEach((r) => {
          if (!(r.totalMarks in rankMap)) {
            rankMap[r.totalMarks] = rankCounter++;
          }
        });

        const rank = rankMap[studentResult.totalMarks] || "-";

        return {
          ...studentResult.toObject(),
          rank,
        };
      })
    );

    res.status(200).json(resultsWithRank);
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

    const results = await Result.find(query).sort({ totalMarks: -1 }); // Sort by totalMarks descending

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
    const { filter, max1, max2, max3 } = req.query;
 console.log(`Fetching quiz performance for batch: ${batch}, Filter: ${filter}, Max1: ${max1}, Max2: ${max2}, Max3: ${max3}`);
    if (filter === "below75Last3" && (!max1 || !max2 || !max3)) {
      return res.status(400).json({ message: "All three max marks are required." });
    }

    const maxVal1 = parseFloat(max1);
    const maxVal2 = parseFloat(max2);
    const maxVal3 = parseFloat(max3);

    const threshold1 = 0.75 * maxVal1;
    const threshold2 = 0.75 * maxVal2;
    const threshold3 = 0.75 * maxVal3;

    const results = await Result.find({ batch, testType: "quiztest" }).sort({ testDate: -1 });
  console.log("Results:", results); // Debug: Log fetched results
    if (!results.length) {
      return res.status(200).json([]);
    }

    const studentMap = new Map();

    results.forEach(result => {
      const key = `${result.name}-${result.fatherName}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, []);
      }
      studentMap.get(key).push(result);
    });

    const filtered = [];

    for (const [key, studentResults] of studentMap.entries()) {
      const last3 = studentResults.slice(0, 3);

      if (last3.length === 3) {
        last3.sort((a, b) => new Date(a.testDate) - new Date(b.testDate));

        const [r1, r2, r3] = last3;

        if (filter === "below75Last3") {
          const allBelow =
            r1.totalMarks <= threshold1 &&
            r2.totalMarks <= threshold2 &&
            r3.totalMarks <= threshold3;

          const strictlyDecreasing =
            r1.totalMarks > r2.totalMarks &&
            r2.totalMarks > r3.totalMarks;

          console.log("Student:", key);
          console.log("Marks:", r1.totalMarks, r2.totalMarks, r3.totalMarks);
          console.log("Thresholds:", threshold1, threshold2, threshold3);
          console.log("allBelow?", allBelow, "strictlyDecreasing?", strictlyDecreasing);

          if (allBelow && strictlyDecreasing) {
            filtered.push(...last3);
            console.log(filtered); // Debug: Log filtered results
          }
        }
      }
    }

    return res.status(200).json(filtered);
  } catch (err) {
    console.error("Error in quiz performance:", err);
    return res.status(500).json({ message: "Server error" });
  }
});




//Relative - (studentmarks/highestmarks)*100
app.get("/api/student-performance", async (req, res) => {
  const { studentCode, batch, testType } = req.query;

  try {
    const studentTests = await Result.find({
      studentCode,
      batch,
      testType,
    });

    const testDates = studentTests.map(test => test.testDate); // No need to parse

    const results = await Promise.all(
      testDates.map(async (dateStr) => {
        const studentResult = studentTests.find(test => test.testDate === dateStr);
        if (!studentResult) return null;

        // Match results by exact testDate string
        const allResultsOnDate = await Result.find({
          batch,
          testType,
          testDate: dateStr, // use string as-is
        });

        if (!allResultsOnDate.length) return null;

        // Ensure you're calculating highest marks correctly here.
        const highest = {
          physics: Math.max(...allResultsOnDate.map(r => r?.subjectMarks?.physics?.totalMark ?? 0)),
          chemistry: Math.max(...allResultsOnDate.map(r => r?.subjectMarks?.chemistry?.totalMark ?? 0)),
          biology: Math.max(...allResultsOnDate.map(r => r?.subjectMarks?.biology?.totalMark ?? 0)),
          mathematics: Math.max(...allResultsOnDate.map(r => r?.subjectMarks?.mathematics?.totalMark ?? 0)),
          total: Math.max(...allResultsOnDate.map(r => r?.totalMarks ?? 0)),
        };

  //  console.log("Highest Marks:", highest);  

        // Calculate percentages for each subject based on highest marks
        const physicsPercentage = highest.physics ? (studentResult.subjectMarks?.physics?.totalMark || 0) / highest.physics * 100 : 0;
        const chemistryPercentage = highest.chemistry ? (studentResult.subjectMarks?.chemistry?.totalMark || 0) / highest.chemistry * 100 : 0;
        const thirdSubjectPercentage = highest.biology || highest.mathematics
          ? (highest.biology ? (studentResult.subjectMarks?.biology?.totalMark || 0) / highest.biology * 100 : 0) || (highest.mathematics ? (studentResult.subjectMarks?.mathematics?.totalMark || 0) / highest.mathematics * 100 : 0)
          : 0;
        const totalPercentage = highest.total ? (studentResult.totalMarks || 0) / highest.total * 100 : 0;

        // console.log({
        //   testDate: dateStr,
        //   physicsPercentage,
        //   chemistryPercentage,
        //   thirdSubjectPercentage,
        //   totalPercentage,
        // }); 
        // Debug: Log data being sent to frontend

        return {
          testDate: dateStr,
          physics: physicsPercentage.toFixed(2),
          chemistry: chemistryPercentage.toFixed(2),
          third: thirdSubjectPercentage.toFixed(2),
          total: totalPercentage.toFixed(2),
        };
      })
    );

    res.json(results.filter(Boolean).sort((a, b) => new Date(a.testDate) - new Date(b.testDate)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching performance data." });
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




app.get("/api/student-performance", async (req, res) => {
  const { studentCode, batch, testType } = req.query;

  try {
    const studentTests = await Result.find({
      studentCode,
      batch,
      testType,
    });

    // Convert dates to 'YYYY-MM-DD' string format
    const testDates = studentTests.map(test => new Date(test.testDate).toISOString().split("T")[0]);

    const results = await Promise.all(
      testDates.map(async (dateStr) => {
        const [studentResult] = studentTests.filter(test =>
          new Date(test.testDate).toISOString().split("T")[0] === dateStr
        );

        if (!studentResult) {
          return null;
        }

        const allResultsOnDate = await Result.find({
          batch,
          testType,
          testDate: new Date(dateStr), // safe conversion
        });

        const highest = {
          physics: Math.max(...allResultsOnDate.map(r => r?.subjectMarks?.physics?.totalMark || 0)),
          chemistry: Math.max(...allResultsOnDate.map(r => r?.subjectMarks?.chemistry?.totalMark || 0)),
          biology: Math.max(...allResultsOnDate.map(r => r?.subjectMarks?.biology?.totalMark || 0)),
          mathematics: Math.max(...allResultsOnDate.map(r => r?.subjectMarks?.mathematics?.totalMark || 0)),
          total: Math.max(...allResultsOnDate.map(r => r?.totalMarks || 0)),
        };
          // Debug: Log data being sent to frontend
        console.log("Highest Marks:", highest);
        const isNeet = ["dron", "madhav", "nakul"].includes(batch.toLowerCase());

        // Calculate percentages with safety checks
        const physicsPercentage = highest.physics ? (studentResult.subjectMarks?.physics?.totalMark || 0) / highest.physics * 100 : 0;
        const chemistryPercentage = highest.chemistry ? (studentResult.subjectMarks?.chemistry?.totalMark || 0) / highest.chemistry * 100 : 0;
        const thirdSubjectPercentage = isNeet
          ? (highest.biology ? (studentResult.subjectMarks?.biology?.totalMark || 0) / highest.biology * 100 : 0)
          : (highest.mathematics ? (studentResult.subjectMarks?.mathematics?.totalMark || 0) / highest.mathematics * 100 : 0);
        const totalPercentage = highest.total ? (studentResult.totalMarks || 0) / highest.total * 100 : 0;

        // Debug: Log data being sent to frontend
        console.log({
          testDate: dateStr,
          physicsPercentage,
          chemistryPercentage,
          thirdSubjectPercentage,
          totalPercentage,
        });

        return {
          testDate: dateStr,
          physics: physicsPercentage.toFixed(2),
          chemistry: chemistryPercentage.toFixed(2),
          third: thirdSubjectPercentage.toFixed(2),
          total: totalPercentage.toFixed(2),
        };
      })
    );

    res.json(results.filter(Boolean).sort((a, b) => new Date(a.testDate) - new Date(b.testDate)));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching performance data." });
  }
});





// ✅ API to Fetch Student Details by Name
// app.get("/api/students/:name", async (req, res) => {
//   try {
//     const student = await Result.findOne({ name: req.params.name }).select("fatherName batch -_id");
//     if (!student) {
//       return res.status(404).json({ message: "Student not found" });
//     }
//     res.status(200).json(student);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// GET /api/students/:name
// GET /api/students/:name
// app.get("/api/students/:name", async (req, res) => {
//   try {
//     const { name } = req.params;
//     const students = await Result.find({ name }).select("fatherName -_id");

//     if (!students.length) {
//       return res.status(404).json({ message: "Student not found" });
//     }

//     const fatherNames = [...new Set(students.map(s => s.fatherName))]; // Remove duplicates
//     res.status(200).json({ fatherNames });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });
// GET /api/students/:name
app.get("/api/students/:name", async (req, res) => {
  try {
    const students = await Result.find({ name: req.params.name }).select("fatherName batch -_id");

    if (!students.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ students }); // always send as array
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




// Start the Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

