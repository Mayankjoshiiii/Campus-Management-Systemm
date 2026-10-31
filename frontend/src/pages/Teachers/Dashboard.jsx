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

const TeacherDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [teacherData, setTeacherData] = useState(null);
  const [loadingTeacher, setLoadingTeacher] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [classCount, setClassCount] = useState(0);
  const [calendarPdf, setCalendarPdf] = useState(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [currentCalendarTitle, setCurrentCalendarTitle] = useState("");

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const email = localStorage.getItem("userEmail");
        const response = await axios.get(
          `${API_BASE_URL}/faculty/by-email/${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTeacherData(response.data);
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      } finally {
        setLoadingTeacher(false);
      }
    };
    fetchTeacherData();
  }, []);

  useEffect(() => {
    const facultyUnivId = localStorage.getItem("facultyUnivId");

    axios
      .get(`${API_BASE_URL}/AdminDashboard/students/count`, {
        headers: {
          "X-Faculty-UnivId": facultyUnivId,
          "Content-Type": "application/json",
        },
      })
      .then((response) => setStudentCount(response.data))
      .catch((error) => console.error("Error fetching student count:", error));

    axios
      .get(`${API_BASE_URL}/AdminDashboard/faculty/count`, {
        headers: {
          "X-Faculty-UnivId": facultyUnivId,
          "Content-Type": "application/json",
        },
      })
      .then((response) => setTeacherCount(response.data))
      .catch((error) => console.error("Error fetching teacher count:", error));

    axios
      .get(`${API_BASE_URL}/AdminDashboard/classes/count`, {
        headers: {
          "X-Faculty-UnivId": facultyUnivId,
          "Content-Type": "application/json",
        },
      })
      .then((response) => setClassCount(response.data))
      .catch((error) => console.error("Error fetching class count:", error));
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

  if (loadingTeacher) return <div>Loading dashboard...</div>;

  return (
    <DashboardContainer>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Content $isOpen={isOpen}>
        <Section>
          <SectionTitle>
            Welcome, {teacherData?.name || "Teacher"}!
          </SectionTitle>
          <CardContainer>
            <Card>
              <CardTitle>Professional Information</CardTitle>
              <CardContent>
                <div>University ID: {teacherData?.univId || "N/A"}</div>
                <div>Department: {teacherData?.department || "N/A"}</div>
                <div>DOB: {teacherData?.dob || "N/A"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardTitle>Contact Information</CardTitle>
              <CardContent>
                <div>Email: {teacherData?.email || "N/A"}</div>
                <div>Phone: {teacherData?.contactNo || "N/A"}</div>
                <div>Address: {teacherData?.address || "N/A"}</div>
              </CardContent>
            </Card>
          </CardContainer>
        </Section>

        <Section>
          <SectionTitle>Overview</SectionTitle>
          <CardContainer>
            <Card>
              <CardTitle>Total Students</CardTitle>
              <CardContent>{studentCount}</CardContent>
            </Card>
            <Card>
              <CardTitle>Total Teachers</CardTitle>
              <CardContent>{teacherCount}</CardContent>
            </Card>
            <Card>
              <CardTitle>Total Classes</CardTitle>
              <CardContent>{classCount}</CardContent>
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

export default TeacherDashboard;

