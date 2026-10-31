import React, { useState } from "react";
import Sidebar from "./Sidebar";
import {
  StudentsContainer,
  Content,
  StudentsContent,
  StudentsHeader,
  StudentList,
  StudentItem,
  AddStudentForm,
  AddStudentInput,
  AddStudentButton,
  FileUploadContainer,
  FormSection,
  FormRow,
  ActionButton,
  ButtonGroup,
  FormSelect,
  FeedbackMessage,
} from "../../styles/StudentsStyles";

const Students = () => {
  // State for form inputs
  const [studentData, setStudentData] = useState({
    name: "",
    emailId: "",
    univId: "",
    subject: "",
    branch: "",
    semester: "",
    year: "",
    rollNo: "",
    dob: "",
    contactNo: "",
    address: "",
    gender: "",
    nationality: "",
    bloodGroup: "",
    parentContactNo: "",
    parentName: "",
    parentOccupation: "",
  });

  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("single");
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState({
    type: "",
    message: "",
    visible: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    const authToken = localStorage.getItem("authToken");

    // Validate required fields
    if (!studentData.name || !studentData.emailId) {
      setFeedback({
        type: "error",
        message: "Name and Email are required fields",
        visible: true,
      });
      setTimeout(
        () => setFeedback((prev) => ({ ...prev, visible: false })),
        5000
      );
      return;
    }

    setIsLoading(true);

    try {
      // Prepare the student data payload
      const studentPayload = {
        name: studentData.name,
        email: studentData.emailId,
        univId: studentData.univId || null,
        course: studentData.subject || null,
        branch: studentData.branch || null,
        semester: studentData.semester ? parseInt(studentData.semester) : null,
        year: studentData.year ? parseInt(studentData.year) : null,
        rollNo: studentData.rollNo || null,
        dob: studentData.dob || null,
        contactNo: studentData.contactNo
          ? parseInt(studentData.contactNo)
          : null,
        address: studentData.address || null,
        gender: studentData.gender || null,
        nationality: studentData.nationality || null,
        bloodGroup: studentData.bloodGroup || null,
        parentContactNo: studentData.parentContactNo
          ? parseInt(studentData.parentContactNo)
          : null,
        parentName: studentData.parentName || null,
        parentOccupation: studentData.parentOccupation || null,
      };

      const response = await fetch("http://localhost:5000/api/uploadStudent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(studentPayload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to add student";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const newStudent = await response.json();
      setStudents((prev) => [...prev, newStudent]);

      // Reset form
      setStudentData({
        name: "",
        emailId: "",
        univId: "",
        subject: "",
        branch: "",
        semester: "",
        year: "",
        rollNo: "",
        dob: "",
        contactNo: "",
        address: "",
        gender: "",
        nationality: "",
        bloodGroup: "",
        parentContactNo: "",
        parentName: "",
        parentOccupation: "",
      });

      setFeedback({
        type: "success",
        message: "Student added successfully!",
        visible: true,
      });
    } catch (error) {
      console.error("Error adding student:", error);
      setFeedback({
        type: "error",
        message: error.message || "Failed to add student",
        visible: true,
      });
    } finally {
      setIsLoading(false);
      setTimeout(
        () => setFeedback((prev) => ({ ...prev, visible: false })),
        5000
      );
    }
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setFeedback({
        type: "error",
        message: "Please select a file to upload",
        visible: true,
      });
      setTimeout(
        () => setFeedback((prev) => ({ ...prev, visible: false })),
        5000
      );
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        "http://localhost:5000/api/uploadStudentDetails",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        let errorMessage = "Bulk upload failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const count = await response.json();
      setFeedback({
        type: "success",
        message: `Successfully uploaded ${count} students`,
        visible: true,
      });
    } catch (error) {
      console.error("Error in bulk upload:", error);
      setFeedback({
        type: "error",
        message: error.message || "Bulk upload failed",
        visible: true,
      });
    } finally {
      setIsLoading(false);
      setTimeout(
        () => setFeedback((prev) => ({ ...prev, visible: false })),
        5000
      );
    }
  };

  return (
    <StudentsContainer>
      <Sidebar />
      <Content>
        <StudentsContent>
          <StudentsHeader>Student Management</StudentsHeader>

          {feedback.visible && (
            <FeedbackMessage type={feedback.type}>
              {feedback.message}
              <button
                onClick={() =>
                  setFeedback((prev) => ({ ...prev, visible: false }))
                }
              >
                ×
              </button>
            </FeedbackMessage>
          )}

          <ButtonGroup>
            <ActionButton
              active={activeTab === "single"}
              onClick={() => setActiveTab("single")}
              disabled={isLoading}
            >
              Add Single Student
            </ActionButton>
            <ActionButton
              active={activeTab === "bulk"}
              onClick={() => setActiveTab("bulk")}
              disabled={isLoading}
            >
              Bulk Upload
            </ActionButton>
          </ButtonGroup>

          {activeTab === "single" ? (
            <AddStudentForm onSubmit={handleAddStudent}>
              <FormSection>
                <h3>Required Information</h3>
                <FormRow>
                  <div>
                    <label>Full Name *</label>
                    <AddStudentInput
                      type="text"
                      name="name"
                      value={studentData.name}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label>Email *</label>
                    <AddStudentInput
                      type="email"
                      name="emailId"
                      value={studentData.emailId}
                      onChange={handleInputChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </FormRow>

                <FormRow>
                  <div>
                    <label>Roll Number</label>
                    <AddStudentInput
                      type="text"
                      name="rollNo"
                      value={studentData.rollNo}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </FormRow>
              </FormSection>

              <FormSection>
                <h3>Academic Information</h3>
                <FormRow>
                  <div>
                    <label>Course</label>
                    <AddStudentInput
                      type="text"
                      name="subject"
                      value={studentData.subject}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label>Branch</label>
                    <AddStudentInput
                      type="text"
                      name="branch"
                      value={studentData.branch}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </FormRow>

                <FormRow>
                  <div>
                    <label>Semester</label>
                    <AddStudentInput
                      type="number"
                      name="semester"
                      value={studentData.semester}
                      onChange={handleInputChange}
                      min="1"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label>Year</label>
                    <AddStudentInput
                      type="number"
                      name="year"
                      value={studentData.year}
                      onChange={handleInputChange}
                      min="1"
                      disabled={isLoading}
                    />
                  </div>
                </FormRow>
              </FormSection>

              <FormSection>
                <h3>Personal Information</h3>
                <FormRow>
                  <div>
                    <label>Date of Birth</label>
                    <AddStudentInput
                      type="date"
                      name="dob"
                      value={studentData.dob}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label>Gender</label>
                    <FormSelect
                      name="gender"
                      value={studentData.gender}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </FormSelect>
                  </div>
                </FormRow>

                <FormRow>
                  <div>
                    <label>Contact Number</label>
                    <AddStudentInput
                      type="tel"
                      name="contactNo"
                      value={studentData.contactNo}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label>Address</label>
                    <AddStudentInput
                      type="text"
                      name="address"
                      value={studentData.address}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                  </div>
                </FormRow>
              </FormSection>

              <AddStudentButton type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Student"}
              </AddStudentButton>
            </AddStudentForm>
          ) : (
            <FileUploadContainer>
              <h3>Bulk Upload Students</h3>
              <form onSubmit={handleBulkUpload}>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  accept=".csv"
                  required
                  disabled={isLoading}
                />
                <p>Upload CSV file with student details</p>
                <AddStudentButton type="submit" disabled={isLoading}>
                  {isLoading ? "Uploading..." : "Upload File"}
                </AddStudentButton>
              </form>
            </FileUploadContainer>
          )}

          <StudentList>
            <h3>Student Records</h3>
            {students.length > 0 ? (
              students.map((student, index) => (
                <StudentItem key={index}>
                  <strong>Name:</strong> {student.name} <br />
                  <strong>Email:</strong> {student.email} <br />
                  <strong>University ID:</strong> {student.univId || "N/A"}{" "}
                  <br />
                  <strong>Course:</strong> {student.course || "N/A"} <br />
                  <strong>Roll no:</strong> {student.rollNo || "N/A"}
                </StudentItem>
              ))
            ) : (
              <p>No students found</p>
            )}
          </StudentList>
        </StudentsContent>
      </Content>
    </StudentsContainer>
  );
};

export default Students;

