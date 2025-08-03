import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDetailsForCode = ({ onCodeGenerated }) => {
  const [form, setForm] = useState({
    testDate: '',
    name: '',
    fatherName: '',
    batch: '',
  });
  const [batches, setBatches] = useState([]);
  const [studentCode, setStudentCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch batch options
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get('http://localhost:3001/api/batches');
        setBatches(data);
        if (data.length > 0) setForm(f => ({ ...f, batch: data[0].name }));
      } catch { }
    })();
  }, []);

  // Generate student code (your logic here, or fetch from backend)
  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      // Option 1: let backend issue the code
      const res = await axios.post('http://localhost:3001/api/generateStudentCode', form);
      setStudentCode(res.data.studentCode);
      if (onCodeGenerated) onCodeGenerated(res.data.studentCode, form);
    } catch {
      alert('Failed to generate student code');
    }
    setLoading(false);
  };

  return (
    <div>
      <h3>Enter Student Details to Generate Student Code</h3>
      <input
        type="date"
        name="testDate"
        value={form.testDate}
        onChange={e => setForm(f => ({ ...f, testDate: e.target.value }))}
        required
      />
      <input
        type="text"
        name="name"
        value={form.name}
        placeholder="Student Name"
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        required
      />
      <input
        type="text"
        name="fatherName"
        value={form.fatherName}
        placeholder="Father's Name"
        onChange={e => setForm(f => ({ ...f, fatherName: e.target.value }))}
        required
      />
      <select
        name="batch"
        value={form.batch}
        onChange={e => setForm(f => ({ ...f, batch: e.target.value }))}
        required
      >
        {batches.map(batch => <option key={batch._id} value={batch.name}>{batch.name}</option>)}
      </select>
      <button onClick={handleGenerateCode} disabled={loading}>Generate Student Code</button>

      {studentCode && <div>
        <p>Student Code: <strong>{studentCode}</strong></p>
        {/* Optionally: Proceed to marks entry */}
      </div>}
    </div>
  );
};

export default StudentDetailsForCode;
