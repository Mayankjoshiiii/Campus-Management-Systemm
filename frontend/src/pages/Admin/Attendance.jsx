import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  AttendanceContainer,
  Content,
  AttendanceContent,
  AttendanceHeader,
  AttendanceList,
  AttendanceItem,
  StudentName,
  CheckboxLabel,
  Divider,
  SubmitButton,
} from "../../styles/AttendanceStyles";

const Attendance = () => {
  const [students, setStudents] = useState([]); // 🔧 Define the students array

  useEffect(() => {
    // You can later replace this with an actual API call using axios
    const dummyData = [
      { id: 1, name: "Alice" },
      { id: 2, name: "Bob" },
      { id: 3, name: "Charlie" },
    ];
    setStudents(dummyData);
  }, []);

  const handleSubmit = () => {
    console.log("Submit button clicked");
    // Handle form submission logic here
  };

  return (
    <AttendanceContainer>
      <Sidebar />
      <Content>
        <AttendanceContent>
          <AttendanceHeader>Attendance</AttendanceHeader>
          <AttendanceList>
            {students.map((student, index) => (
              <React.Fragment key={student.id}>
                <AttendanceItem>
                  <StudentName>{student.name}</StudentName>
                  <CheckboxLabel>
                    <input type="checkbox" />
                    Present
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input type="checkbox" />
                    Absent
                  </CheckboxLabel>
                  <CheckboxLabel>
                    <input type="checkbox" />
                    Absent with apology
                  </CheckboxLabel>
                </AttendanceItem>
                {index !== students.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </AttendanceList>
          <SubmitButton onClick={handleSubmit}>Submit</SubmitButton>
        </AttendanceContent>
      </Content>
    </AttendanceContainer>
  );
};

export default Attendance;
