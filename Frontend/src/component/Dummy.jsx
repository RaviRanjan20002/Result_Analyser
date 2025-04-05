import React from "react";
import { useState } from "react";
const Dummy = () => {
  const arr = ["physics", "chemistry", "mathematics"];
  const [name, setName] = useState("");
 const handlechange = (e) => {
    setName(e.target.value);
 }
  return (
    <div>
      <form>
        <label>name</label>
        <input type="text" name="name" value={name} placeholder="Enter your name" onChange={handlechange} required />
        <label>fatherName</label>
        <input
          type="text"
          name="fatherName"
          placeholder="Enter your father name"
          required
        />
        <label>batch</label>
        <select name="batch" onChange={handlechange} required>
          <option value="bhim">bhim</option>
          <option value="nakul">nakul</option>
          <option value="arjun">arjun</option>
        </select>
        {arr.map((subject, id) => (
          <>
            <div key={id}>{subject}</div>
            <input
              type="number"
              name={subject}
              placeholder={` ${subject} correct marks`}
              required
            />
            <input
              type="number"
              name={subject}
              placeholder={` ${subject} incorrect marks`}
              required
            />
            <input
              type="number"
              name={subject}
              placeholder={` ${subject} total marks`}
              required
            />
          </>
        ))}
      </form>
    </div>
  );
};

export default Dummy;
