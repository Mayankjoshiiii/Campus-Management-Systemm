import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import EventCalendar from "./EventCalendar";
import Announcement from "./Announcement";
import Performance from "./Performance";
import {
  AdminDashboardContainer,
  Content,
  TopContent,
  BottomContent,
  Section,
  SectionTitle,
  CardContainer,
  Card,
  CardTitle,
  CardContent,
  Modal,
  ModalContent,
  ModalActions,
  Button,
  Input,
  FileInput,
  PDFViewer,
} from "../../styles/DashboardStyles";
import axios from "axios";

const AdminDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);
  const [calendarPdf, setCalendarPdf] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newCalendarTitle, setNewCalendarTitle] = useState("Academic Calendar");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [currentCalendarTitle, setCurrentCalendarTitle] = useState("");

  // Dummy data
  const events = [
    { title: "Science Fair", date: "2025-04-25" },
    { title: "Exam Week", date: "2025-05-01" },
  ];

  const announcements = [
    { id: 1, text: "All students must submit their assignments by Friday." },
    { id: 2, text: "Teacher's workshop this weekend." },
  ];

  const studentPerformance = [
    { name: "Ankit", score: 92 },
    { name: "Riya", score: 88 },
    { name: "Aman", score: 76 },
  ];

  const zoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2)); // Max zoom 200%
  };

  const zoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5)); // Min zoom 50%
  };

  const resetZoom = () => {
    setZoomLevel(1);
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch counts
        const [studentRes, teacherRes] = await Promise.all([
          axios.get("http://localhost:5000/api/AdminDashboard/students/count"),
          axios.get("http://localhost:5000/api/AdminDashboard/faculty/count"),
        ]);
        setStudentCount(studentRes.data);
        setTeacherCount(teacherRes.data);

        // Fetch current calendar
        await fetchCurrentCalendar();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    return () => {
      if (calendarPdf) {
        URL.revokeObjectURL(calendarPdf);
      }
    };
  }, []);

  const fetchCurrentCalendar = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/calendar", {
        responseType: "blob",
      });

      if (response.data.size > 0) {
        const pdfUrl = URL.createObjectURL(response.data);
        setCalendarPdf(pdfUrl);

        // Extract title from headers if available
        const title = response.headers["x-title"] || "Academic Calendar";
        setCurrentCalendarTitle(title);
      }
    } catch (error) {
      console.error("Error fetching calendar:", error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setUploadStatus(null);
    } else {
      setUploadStatus("Please select a valid PDF file");
    }
  };

  const handleUploadCalendar = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("title", newCalendarTitle);

    try {
      setUploadStatus("Uploading...");

      await axios.post("http://localhost:5000/api/calendar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh the calendar
      await fetchCurrentCalendar();

      setUploadStatus("Calendar updated successfully!");
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadStatus(null);
      }, 1500);
    } catch (error) {
      console.error("Error uploading calendar:", error);
      setUploadStatus("Failed to upload calendar. Please try again.");
    }
  };

  return (
    <AdminDashboardContainer>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <Content $isOpen={isOpen}>
        <TopContent>
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
                <CardTitle>Academic Calendar</CardTitle>
                <CardContent>
                  {calendarPdf ? (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "10px",
                      }}
                    >
                      <p style={{ fontWeight: "bold" }}>
                        {currentCalendarTitle}
                      </p>
                      <PDFViewer
                        src={calendarPdf}
                        width="100%"
                        height="250px"
                        title="Academic Calendar"
                      />
                      <Button
                        onClick={() => setShowUploadModal(true)}
                        style={{ marginTop: "10px" }}
                      >
                        Update Calendar
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <p>No calendar available</p>
                      <Button onClick={() => setShowUploadModal(true)}>
                        Upload Calendar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </CardContainer>
          </Section>

          <Section>
            <EventCalendar events={events} />
          </Section>
        </TopContent>

        <BottomContent>
          <Performance studentPerformance={studentPerformance} />
          <Announcement announcements={announcements} />
        </BottomContent>

        {/* Calendar Upload Modal */}
        {showUploadModal && (
          <Modal onClick={() => setShowUploadModal(false)}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <h3>Update Academic Calendar</h3>
              <Input
                type="text"
                value={newCalendarTitle}
                onChange={(e) => setNewCalendarTitle(e.target.value)}
                placeholder="Calendar Title"
              />
              <FileInput
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
              />
              {selectedFile && (
                <p style={{ margin: "10px 0" }}>
                  Selected file: {selectedFile.name} (
                  {(selectedFile.size / 1024).toFixed(2)} KB)
                </p>
              )}
              {uploadStatus && (
                <p
                  style={{
                    color: uploadStatus.includes("success") ? "green" : "red",
                    margin: "10px 0",
                  }}
                >
                  {uploadStatus}
                </p>
              )}
              <ModalActions>
                <Button onClick={handleUploadCalendar}>Upload</Button>
                <Button
                  secondary
                  onClick={() => {
                    setShowUploadModal(false);
                    setUploadStatus(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalActions>
            </ModalContent>
          </Modal>
        )}
      </Content>
    </AdminDashboardContainer>
  );
};

export default AdminDashboard;

