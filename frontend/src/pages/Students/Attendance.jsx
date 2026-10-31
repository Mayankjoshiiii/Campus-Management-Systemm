// import React, { useState, useEffect } from "react";
// import Sidebar from "./Sidebar";
// import axios from "axios";
// import {
//   AttendanceContainer,
//   SidebarContainer,
//   Content,
//   AttendanceHeader,
//   AttendanceList,
//   AttendanceItem,
//   AttendanceDate,
//   AttendanceStatus,
//   LoadingMessage,
//   ErrorMessage,
//   EmptyMessage,
//   SubjectFilter,
//   StatsContainer,
//   StatsItem,
//   StatsTitle,
//   StatsValue,
//   AttendanceSubject,
//   RemarksText,
// } from "../../styles/AttendanceStyles";

// const API_BASE_URL = "http://localhost:5000/api";

// const AttendanceSection = () => {
//   const [attendance, setAttendance] = useState([]);
//   const [subjects, setSubjects] = useState([]);
//   const [selectedSubject, setSelectedSubject] = useState("all");
//   const [stats, setStats] = useState(null);
//   const [loading, setLoading] = useState({
//     attendance: true,
//     subjects: true,
//     stats: true,
//   });
//   const [error, setError] = useState(null);

//   const authConfig = {
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//     },
//   };

//   const fetchData = async () => {
//     try {
//       const email = localStorage.getItem("userEmail");

//       // Fetch all data in parallel
//       const [attendanceRes, subjectsRes, statsRes] = await Promise.all([
//         axios.get(`${API_BASE_URL}/attendance/student/${email}`, authConfig),
//         axios.get(
//           `${API_BASE_URL}/attendance/student/${email}/subjects`,
//           authConfig
//         ),
//         axios.get(
//           `${API_BASE_URL}/students/${email}/attendance-summary`,
//           authConfig
//         ),
//       ]);

//       setAttendance(attendanceRes.data);
//       setSubjects(subjectsRes.data);
//       setStats(statsRes.data);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     } finally {
//       setLoading({ attendance: false, subjects: false, stats: false });
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const filteredAttendance =
//     selectedSubject === "all"
//       ? attendance
//       : attendance.filter(
//           (item) =>
//             item.subject && item.subject.id.toString() === selectedSubject
//         );

//   return (
//     <AttendanceContainer>
//       <SidebarContainer>
//         <Sidebar />
//       </SidebarContainer>
//       <Content>
//         <AttendanceHeader>My Attendance Records</AttendanceHeader>

//         {stats && (
//           <StatsContainer>
//             <StatsItem>
//               <StatsTitle>Overall Attendance</StatsTitle>
//               <StatsValue>{stats.overallPercentage}%</StatsValue>
//             </StatsItem>
//             <StatsItem>
//               <StatsTitle>From Date</StatsTitle>
//               <StatsValue>
//                 {new Date(stats.startDate).toLocaleDateString()}
//               </StatsValue>
//             </StatsItem>
//             <StatsItem>
//               <StatsTitle>To Date</StatsTitle>
//               <StatsValue>
//                 {new Date(stats.endDate).toLocaleDateString()}
//               </StatsValue>
//             </StatsItem>
//           </StatsContainer>
//         )}

//         {loading.subjects ? (
//           <LoadingMessage>Loading subjects...</LoadingMessage>
//         ) : (
//           <SubjectFilter
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//           >
//             <option value="all">All Subjects</option>
//             {subjects.map((subject) => (
//               <option key={subject.id} value={subject.id}>
//                 {subject.subjectName} ({subject.subjectCode})
//               </option>
//             ))}
//           </SubjectFilter>
//         )}

//         {loading.attendance ? (
//           <LoadingMessage>Loading attendance records...</LoadingMessage>
//         ) : error ? (
//           <ErrorMessage>{error}</ErrorMessage>
//         ) : filteredAttendance.length === 0 ? (
//           <EmptyMessage>No attendance records found</EmptyMessage>
//         ) : (
//           <AttendanceList>
//             {filteredAttendance.map((record) => (
//               <AttendanceItem key={record.id}>
//                 <AttendanceDate>
//                   {new Date(record.date).toLocaleDateString()}
//                 </AttendanceDate>
//                 <AttendanceSubject>
//                   {record.subjectName} ({record.subjectCode})
//                 </AttendanceSubject>
//                 <AttendanceStatus
//                   className={record.present ? "present" : "absent"}
//                 >
//                   {record.present ? "Present" : "Absent"}
//                 </AttendanceStatus>
//                 {record.remarks && (
//                   <RemarksText>Remarks: {record.remarks}</RemarksText>
//                 )}
//               </AttendanceItem>
//             ))}
//           </AttendanceList>
//         )}
//       </Content>
//     </AttendanceContainer>
//   );
// };

// export default AttendanceSection;
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  AttendanceContainer,
  SidebarContainer,
  Content,
  AttendanceHeader,
  AttendanceList,
  AttendanceItem,
  AttendanceDate,
  AttendanceStatus,
  LoadingMessage,
  ErrorMessage,
  EmptyMessage,
  SubjectFilter,
  StatsContainer,
  StatsItem,
  StatsTitle,
  StatsValue,
  AttendanceSubject,
  RemarksText,
} from "../../styles/AttendanceStyles";

const API_BASE_URL = "http://localhost:5000/api";

const AttendanceSection = () => {
  const [attendance, setAttendance] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState({
    attendance: true,
    subjects: true,
    stats: true,
  });
  const [error, setError] = useState(null);

  const authConfig = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const email = localStorage.getItem("userEmail");

        const [subjectsRes, statsRes] = await Promise.all([
          axios.get(
            `${API_BASE_URL}/attendance/student/${email}/subjects`,
            authConfig
          ),
          axios.get(
            `${API_BASE_URL}/students/${email}/attendance-summary`,
            authConfig
          ),
        ]);

        setSubjects(subjectsRes.data);
        setStats(statsRes.data);
        setLoading((prev) => ({ ...prev, subjects: false, stats: false }));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading((prev) => ({ ...prev, subjects: false, stats: false }));
      }
    };

    fetchAllData();
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading((prev) => ({ ...prev, attendance: true }));
        const email = localStorage.getItem("userEmail");
        let url = `${API_BASE_URL}/attendance/student/${email}`;

        if (selectedSubject !== "all") {
          url = `${API_BASE_URL}/attendance/student/${email}/subject/${selectedSubject}`;
        }

        const res = await axios.get(url, authConfig);
        setAttendance(res.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading((prev) => ({ ...prev, attendance: false }));
      }
    };

    fetchAttendance();
  }, [selectedSubject]);

  return (
    <AttendanceContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <Content>
        <AttendanceHeader>My Attendance Records</AttendanceHeader>

        {stats && (
          <StatsContainer>
            <StatsItem>
              <StatsTitle>Overall Attendance</StatsTitle>
              <StatsValue>{stats.overallPercentage}%</StatsValue>
            </StatsItem>
            <StatsItem>
              <StatsTitle>From Date</StatsTitle>
              <StatsValue>
                {new Date(stats.startDate).toLocaleDateString()}
              </StatsValue>
            </StatsItem>
            <StatsItem>
              <StatsTitle>To Date</StatsTitle>
              <StatsValue>
                {new Date(stats.endDate).toLocaleDateString()}
              </StatsValue>
            </StatsItem>
          </StatsContainer>
        )}

        {loading.subjects ? (
          <LoadingMessage>Loading subjects...</LoadingMessage>
        ) : (
          <SubjectFilter
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.subjectName} ({subject.subjectCode})
              </option>
            ))}
          </SubjectFilter>
        )}

        {loading.attendance ? (
          <LoadingMessage>Loading attendance records...</LoadingMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : attendance.length === 0 ? (
          <EmptyMessage>No attendance records found</EmptyMessage>
        ) : (
          <AttendanceList>
            {attendance.map((record) => (
              <AttendanceItem key={record.id}>
                <AttendanceDate>
                  {new Date(record.date).toLocaleDateString()}
                </AttendanceDate>
                <AttendanceSubject>
                  {record.subjectName} ({record.subjectCode})
                </AttendanceSubject>
                <AttendanceStatus
                  className={record.present ? "present" : "absent"}
                >
                  {record.present ? "Present" : "Absent"}
                </AttendanceStatus>
                {record.remarks && (
                  <RemarksText>Remarks: {record.remarks}</RemarksText>
                )}
              </AttendanceItem>
            ))}
          </AttendanceList>
        )}
      </Content>
    </AttendanceContainer>
  );
};

export default AttendanceSection;

