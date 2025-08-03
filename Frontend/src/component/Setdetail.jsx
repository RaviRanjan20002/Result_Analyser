import React, { useState } from "react";
import StudentDetailsForCode from "./StudentDetailsForCode";
import MarksEntryByStudentCode from "./MarksEntryByStudentCode";

const SetDetailsPage = () => {
  const [showMarksEntry, setShowMarksEntry] = useState(false);

  return (
    <div>
      <button onClick={() => setShowMarksEntry(false)}>Generate Student Code</button>
      <button onClick={() => setShowMarksEntry(true)}>Entry of Marks</button>
      {showMarksEntry ? <MarksEntryByStudentCode /> : <StudentDetailsForCode />}
    </div>
  );
};

export default SetDetailsPage;
