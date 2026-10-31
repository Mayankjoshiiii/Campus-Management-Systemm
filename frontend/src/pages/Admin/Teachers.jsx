import React, { useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  TeachersContainer,
  Content,
  TeachersContent,
  TeachersHeader,
  AddTeacherForm,
  AddTeacherInput,
  AddTeacherButton,
  ErrorMessage,
} from "../../styles/TeachersStyles";

const Teachers = () => {
  const [formData, setFormData] = useState({
    name: "",
    department: "",
    email: "",
    dob: "",
    contactNo: "",
    address: "",
    gender: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    // Validate required fields
    const requiredFields = [
      "name",
      "department",
      "email",
      "dob",
      "contactNo",
      "address",
      "gender",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      setIsLoading(false);
      return;
    }

    // Validate contact number
    if (isNaN(formData.contactNo)) {
      setError("Contact number must be a valid number");
      setIsLoading(false);
      return;
    }

    // Prepare data for backend
    const payload = {
      ...formData,
      contactNo: Number(formData.contactNo), // Convert to number as backend expects long
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/uploadFaculty",
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
            "Content-Type": "application/json", // Match backend expectation
          },
        }
      );

      setMessage("Faculty added successfully");
      // Reset form
      setFormData({
        name: "",
        department: "",
        email: "",
        dob: "",
        contactNo: "",
        address: "",
        gender: "",
      });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "Error adding faculty";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TeachersContainer>
      <Sidebar />
      <Content>
        <TeachersContent>
          <TeachersHeader>Faculty Management</TeachersHeader>
          <AddTeacherForm onSubmit={handleSubmit}>
            <AddTeacherInput
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <AddTeacherInput
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleInputChange}
              required
            />
            <AddTeacherInput
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <AddTeacherInput
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              required
            />
            <AddTeacherInput
              type="number"
              name="contactNo"
              placeholder="Contact Number"
              value={formData.contactNo}
              onChange={handleInputChange}
              required
            />
            <AddTeacherInput
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />
            <AddTeacherInput
              type="text"
              name="gender"
              placeholder="Gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            />
            <AddTeacherButton type="submit" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Faculty"}
            </AddTeacherButton>
          </AddTeacherForm>
          {message && <p style={{ color: "green" }}>{message}</p>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </TeachersContent>
      </Content>
    </TeachersContainer>
  );
};

export default Teachers;

