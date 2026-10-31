import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  StudentsContainer,
  Content,
  StudentsContent,
  StudentsHeader,
  StudentList,
  StudentItem,
  StudentInfo,
  StudentLabel,
  StudentValue,
  LoadingMessage,
  ErrorMessage,
  ActionButton,
  ButtonGroup,
} from "../../styles/StudentsStyles";

const API_BASE_URL = "http://localhost:5000/api";

const StudentSection = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `${API_BASE_URL}/faculty/students/all`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("API Response:", response.data); // Debug log

        // Ensure we're working with an array
        let studentData = Array.isArray(response.data)
          ? response.data
          : response.data
          ? [response.data]
          : [];

        // Map the data to ensure proper structure
        const formattedStudents = studentData.map((student, index) => ({
          id: student.id || index, // Use index as fallback if id doesn't exist
          name: student.name || "N/A",
          email: student.email || "N/A",
          rollNo: student.rollNo || student.rollNumber || "N/A", // Check for alternative field names
          course: student.course || student.courseName || "N/A", // Check for alternative field names
        }));

        console.log("Formatted students:", formattedStudents); // Debug log
        setStudents(formattedStudents);
      } catch (err) {
        console.error("Error fetching students:", err);
        setError(
          err.response?.data?.message ||
            "Failed to fetch students. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleViewDetails = (studentId) => {
    console.log("View details for student:", studentId);
    // Implement view details logic
  };

  const handleEdit = (studentId) => {
    console.log("Edit student:", studentId);
    // Implement edit logic
  };

  if (loading) return <LoadingMessage>Loading students...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <StudentsContainer>
      <Sidebar />
      <Content>
        <StudentsContent>
          <StudentsHeader>Students</StudentsHeader>
          <StudentList>
            {students.length > 0 ? (
              students.map((student) => (
                <StudentItem key={student.id}>
                  <StudentInfo>
                    <div>
                      <StudentLabel>Name:</StudentLabel>
                      <StudentValue>{student.name}</StudentValue>
                    </div>
                    <div>
                      <StudentLabel>Email:</StudentLabel>
                      <StudentValue>{student.email}</StudentValue>
                    </div>
                    <div>
                      <StudentLabel>Roll No:</StudentLabel>
                      <StudentValue>{student.rollNo}</StudentValue>
                    </div>
                    <div>
                      <StudentLabel>Course:</StudentLabel>
                      <StudentValue>{student.course}</StudentValue>
                    </div>
                  </StudentInfo>
                  <ButtonGroup>
                    <ActionButton onClick={() => handleViewDetails(student.id)}>
                      View Details
                    </ActionButton>
                    <ActionButton $edit onClick={() => handleEdit(student.id)}>
                      Edit
                    </ActionButton>
                  </ButtonGroup>
                </StudentItem>
              ))
            ) : (
              <ErrorMessage>No students found</ErrorMessage>
            )}
          </StudentList>
        </StudentsContent>
      </Content>
    </StudentsContainer>
  );
};

export default StudentSection;

