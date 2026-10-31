import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import {
  DashboardContainer,
  Content,
  Section,
  SectionTitle,
  CardContainer,
  Card,
  CardTitle,
  CardContent,
  PDFViewer,
} from "../../styles/DashboardStyles";

const API_BASE_URL = "http://localhost:5000/api";

const StudentDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [loadingStudent, setLoadingStudent] = useState(true);
  const [calendarPdf, setCalendarPdf] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [currentCalendarTitle, setCurrentCalendarTitle] = useState("");

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const email = localStorage.getItem("userEmail");
        const response = await axios.get(
          `${API_BASE_URL}/students/by-email/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudentData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoadingStudent(false);
      }
    };
    fetchStudentData();
  }, []);

  useEffect(() => {
    const fetchCalendar = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/calendar`, {
          responseType: "blob",
        });
        if (response.data.size > 0) {
          const pdfUrl = URL.createObjectURL(response.data);
          setCalendarPdf(pdfUrl);
          const header = response.headers["content-disposition"];
          const match = header && header.match(/filename="(.+)"/);
          setCurrentCalendarTitle(match ? match[1] : "Academic Calendar");
        }
      } catch (error) {
        console.error("Error fetching calendar:", error);
      } finally {
        setLoadingCalendar(false);
      }
    };
    fetchCalendar();
    return () => {
      if (calendarPdf) URL.revokeObjectURL(calendarPdf);
    };
  }, []);

  if (loadingStudent) return <div>Loading dashboard...</div>;

  return (
    <DashboardContainer>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Content $isOpen={isOpen}>
        <Section>
          <SectionTitle>
            Welcome, {studentData?.name || "Student"}!
          </SectionTitle>
          <CardContainer>
            <Card>
              <CardTitle>Academic Information</CardTitle>
              <CardContent>
                <div>University ID: {studentData?.univId || "N/A"}</div>
                <div>Program: {studentData?.course || "N/A"}</div>
                <div>Semester: {studentData?.semester || "N/A"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Contact Information</CardTitle>
              <CardContent>
                <div>Email: {studentData?.email || "N/A"}</div>
                <div>Phone: {studentData?.contactNo || "N/A"}</div>
                <div>Address: {studentData?.address || "N/A"}</div>
              </CardContent>
            </Card>
          </CardContainer>
        </Section>
        <Section>
          <SectionTitle>{currentCalendarTitle}</SectionTitle>
          {loadingCalendar ? (
            <div>Loading calendar...</div>
          ) : calendarPdf ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PDFViewer
                src={calendarPdf}
                width="80%"
                height="600px"
                title={currentCalendarTitle}
              />
            </div>
          ) : (
            <div>No calendar available.</div>
          )}
        </Section>
      </Content>
    </DashboardContainer>
  );
};

export default StudentDashboard;

