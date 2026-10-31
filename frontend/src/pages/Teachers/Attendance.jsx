import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "./Sidebar";
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
  LoadingMessage,
  EmptyMessage,
  DatePicker,
  SubjectSelector,
  StatsContainer,
  StatsItem,
  StatsTitle,
  StatsValue,
  StudentInfo,
  RemarksInput,
  AttendanceControls,
  RadioGroup,
} from "../../styles/AttendanceStyles";

const API_BASE_URL = "http://localhost:5000/api";

const CheckAttendanceSection = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [students, setStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState({
    subjects: false,
    students: false,
    stats: false,
    submission: false,
  });

  const authConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading((prev) => ({ ...prev, subjects: true }));
      const facultyEmail = localStorage.getItem("userEmail");
      const response = await axios.get(
        `${API_BASE_URL}/attendance/faculty/${facultyEmail}/subjects`,
        authConfig
      );
      setSubjects(response.data);
      if (response.data.length > 0) {
        setSelectedSubject(response.data[0].id);
      }
    } catch (err) {
      toast.error(
        "Failed to fetch subjects: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading((prev) => ({ ...prev, subjects: false }));
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    if (!selectedSubject) return;
    try {
      setLoading((prev) => ({ ...prev, students: true }));
      const response = await axios.get(
        `${API_BASE_URL}/attendance/subject/${selectedSubject}/date/${date}`,
        authConfig
      );

      const studentList = response.data.map((item) => ({
        id: item.id,
        email: item.studentEmail,
        name: item.studentName,
        rollNo: item.studentRollNo,
      }));

      setStudents(studentList);

      const initialData = {};
      studentList.forEach((student) => {
        const attendance = response.data.find(
          (a) => a.studentEmail === student.email
        );
        initialData[student.email] = {
          present: attendance ? attendance.present : null,
          remarks: attendance ? attendance.remarks : "",
        };
      });

      setAttendanceData(initialData);
    } catch (err) {
      toast.error(
        "Failed to fetch attendance: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading((prev) => ({ ...prev, students: false }));
    }
  }, [selectedSubject, date]);

  const fetchStats = useCallback(async () => {
    if (!selectedSubject) return;
    try {
      setLoading((prev) => ({ ...prev, stats: true }));
      const response = await axios.get(
        `${API_BASE_URL}/attendance/stats/subject/${selectedSubject}`,
        authConfig
      );
      setStats(response.data);
    } catch (err) {
      toast.error(
        "Failed to fetch stats: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  }, [selectedSubject]);

  const handleSubmit = async () => {
    try {
      setLoading((prev) => ({ ...prev, submission: true }));

      const facultyEmail = localStorage.getItem("userEmail");
      const studentAttendances = students.map((student) => ({
        studentEmail: student.email,
        present: attendanceData[student.email]?.present || false,
        remarks: attendanceData[student.email]?.remarks || "",
      }));

      const request = {
        facultyEmail,
        subjectId: selectedSubject,
        date,
        studentAttendances,
      };

      await axios.post(`${API_BASE_URL}/attendance/bulk`, request, authConfig);
      toast.success("Attendance submitted successfully!");
      fetchStats();
    } catch (err) {
      toast.error(
        "Submission failed: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) {
      fetchAttendance();
      fetchStats();
    }
  }, [selectedSubject, date, fetchAttendance, fetchStats]);

  return (
    <AttendanceContainer>
      <Content>
        <AttendanceHeader>
          Mark Attendance - {new Date(date).toLocaleDateString()}
        </AttendanceHeader>

        <ToastContainer position="top-center" autoClose={3000} />

        {loading.subjects ? (
          <LoadingMessage>Loading subjects...</LoadingMessage>
        ) : subjects.length > 0 ? (
          <>
            <SubjectSelector
              value={selectedSubject || ""}
              onChange={(e) => setSelectedSubject(e.target.value)}
              disabled={loading.subjects || loading.students}
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subjectName} ({subject.subjectCode})
                </option>
              ))}
            </SubjectSelector>

            <DatePicker
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split("T")[0]}
            />

            {stats && (
              <StatsContainer>
                <StatsItem>
                  <StatsTitle>Total Classes</StatsTitle>
                  <div>{stats.totalClasses}</div>
                </StatsItem>
                <StatsItem>
                  <StatsTitle>Average Attendance</StatsTitle>
                  <div>{stats.attendancePercentage}%</div>
                </StatsItem>
              </StatsContainer>
            )}

            {loading.students ? (
              <LoadingMessage>Loading students...</LoadingMessage>
            ) : students.length === 0 ? (
              <div>No students found for this subject</div>
            ) : (
              <>
                <AttendanceList>
                  {students.map((student) => (
                    <AttendanceItem key={`student-${student.email}`}>
                      <StudentInfo>
                        <div>{student.name}</div>
                        <div>
                          {student.rollNo} • {student.email}
                        </div>
                      </StudentInfo>

                      <AttendanceControls>
                        <RadioGroup>
                          <CheckboxLabel>
                            <input
                              type="radio"
                              checked={
                                attendanceData[student.email]?.present === true
                              }
                              onChange={() => {
                                setAttendanceData((prev) => ({
                                  ...prev,
                                  [student.email]: {
                                    ...(prev[student.email] || {}),
                                    present: true,
                                  },
                                }));
                              }}
                            />
                            Present
                          </CheckboxLabel>

                          <CheckboxLabel>
                            <input
                              type="radio"
                              checked={
                                attendanceData[student.email]?.present === false
                              }
                              onChange={() => {
                                setAttendanceData((prev) => ({
                                  ...prev,
                                  [student.email]: {
                                    ...(prev[student.email] || {}),
                                    present: false,
                                  },
                                }));
                              }}
                            />
                            Absent
                          </CheckboxLabel>
                        </RadioGroup>

                        <RemarksInput
                          value={attendanceData[student.email]?.remarks || ""}
                          onChange={(e) => {
                            setAttendanceData((prev) => ({
                              ...prev,
                              [student.email]: {
                                ...(prev[student.email] || {}),
                                remarks: e.target.value,
                              },
                            }));
                          }}
                          placeholder="Remarks"
                        />
                      </AttendanceControls>
                    </AttendanceItem>
                  ))}
                </AttendanceList>

                <SubmitButton
                  onClick={handleSubmit}
                  disabled={loading.submission || students.length === 0}
                >
                  {loading.submission ? "Submitting..." : "Submit Attendance"}
                </SubmitButton>
              </>
            )}
          </>
        ) : (
          <div>No subjects assigned to you</div>
        )}
      </Content>
    </AttendanceContainer>
  );
};
export default CheckAttendanceSection;

