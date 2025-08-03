import React, { useState } from 'react';
import axios from 'axios';

const MarksEntryByStudentCode = () => {
  const [studentCode, setStudentCode] = useState('');
  const [testType, setTestType] = useState('jeemains');
  const [testDate, setTestDate] = useState('');
  const [student, setStudent] = useState(null); // { name, fatherName, batch }
  const [subjectMarks, setSubjectMarks] = useState({
    physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
    chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
    biology:    { correctMark: 0, incorrectMark: 0, totalMark: 0 },
    mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
  });

  // 1. Fetch student details on code entry
  const fetchStudentFromCode = async () => {
    if (studentCode.length === 0) return;
    try {
      const res = await axios.get(`http://localhost:3001/api/studentByCode/${studentCode}`);
      setStudent(res.data.student);
    } catch {
      setStudent(null);
      alert('Student code not found');
    }
  };

  // 2. Marks fields change
  const handleSubjectMarkChange = (subject, field, value) => {
    setSubjectMarks(prev => ({
      ...prev,
      [subject]: { ...prev[subject], [field]: Number(value) || 0 }
    }));
  };

  // 3. Submit marks
  const handleMarksSubmit = async e => {
    e.preventDefault();
    if (!student) return alert('Fetch student first!');
    const totalMarks =
      subjectMarks.physics.totalMark +
      subjectMarks.chemistry.totalMark +
      (student.batch === "Z"
        ? subjectMarks.mathematics.totalMark + subjectMarks.biology.totalMark
        : testType === "neet" ||
          ["Dron", "Madhav", "Nakul"].includes(student.batch)
          ? subjectMarks.biology.totalMark
          : subjectMarks.mathematics.totalMark);

    try {
      await axios.post('https://result-analyserr.onrender.com/api/results', {
        testDate,
        name: student.name,
        fatherName: student.fatherName,
        batch: student.batch,
        testType,
        subjectMarks,
        totalMarks,
        studentCode
      });
      alert('✅ Result Saved');
      setStudent(null); setStudentCode('');
      setSubjectMarks({
        physics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
        chemistry: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
        biology: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
        mathematics: { correctMark: 0, incorrectMark: 0, totalMark: 0 },
      });
    } catch (err) {
      alert('❌ Failed to save');
    }
  };

  return (
    <div>
      <h3>Enter Marks By Student Code</h3>
      <form onSubmit={handleMarksSubmit}>
        <input
          type="text"
          value={studentCode}
          onChange={e => setStudentCode(e.target.value)}
          onBlur={fetchStudentFromCode}
          placeholder="Enter Student Code"
          required
        />
        <input
          type="date"
          value={testDate}
          onChange={e => setTestDate(e.target.value)}
          required
        />
        <select value={testType} onChange={e => setTestType(e.target.value)} required>
          <option value="jeemains">JEE Mains</option>
          <option value="jeeadvanced">JEE Advanced</option>
          <option value="neet">NEET</option>
          <option value="topictest">Topic Test</option>
          <option value="quiztest">Quiz Test</option>
          <option value="other">Other</option>
        </select>
        {/* Show student details (auto-filled/locked) */}
        {student && (
          <div>
            <div>Name: {student.name}</div>
            <div>Father: {student.fatherName}</div>
            <div>Batch: {student.batch}</div>
          </div>
        )}
        {/* Marks entry (show only after student found) */}
        {student && (
          <>
            {["physics", "chemistry"].map((subject) => (
              <div key={subject}>
                <h4>{subject.toUpperCase()}</h4>
                <input
                  type="number"
                  placeholder="Correct marks"
                  value={subjectMarks[subject].correctMark}
                  onChange={e => handleSubjectMarkChange(subject, "correctMark", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Incorrect marks"
                  value={subjectMarks[subject].incorrectMark}
                  onChange={e => handleSubjectMarkChange(subject, "incorrectMark", e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Total marks"
                  value={subjectMarks[subject].totalMark}
                  onChange={e => handleSubjectMarkChange(subject, "totalMark", e.target.value)}
                  required
                />
              </div>
            ))}
            {/* Math/Biology fields, same as before but using student.batch and testType */}
            {/* ... */}
            <button type="submit">Save Marks</button>
          </>
        )}
      </form>
    </div>
  );
};

export default MarksEntryByStudentCode;
