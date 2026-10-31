import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../src/components/Home";
import SignIn from "./components/SignIn";
import AdminDashboard from "./pages/Admin/Dashboard";
import StudentDashboard from "./pages/Students/Dashboard";
import TeacherDashboard from "./pages/Teachers/Dashboard";

import Classes from "./pages/Admin/Classes";
import Exam from "./pages/Admin/Exam";
import Attendance from "./pages/Admin/Attendance";
import Performance from "./pages/Admin/Performance";
import Teachers from "./pages/Admin/Teachers";
import Students from "./pages/Admin/Students";
import Assignments from "./pages/Admin/Assignment";
import Library from "./pages/Admin/Library";
import EventCalendar from "./pages/Admin/EventCalendar";
import SettingsProfile from "./pages/Admin/SettingsProfile";
import Announcement from "./pages/Admin/Announcement";

import StudentAssignments from "../src/pages/Students/Assignments";
import ExamSection from "../src/pages/Students/Exams";
import PerformanceSection from "../src/pages/Students/Performance";
import AttendanceSection from "../src/pages/Students/Attendance";
import LibrarySection from "../src/pages/Students/Library";
import AnnouncementSection from "../src/pages/Students/Announcements";
import ProfileSection from "../src/pages/Students/Profile";

import ClassSection from "../src/pages/Teachers/Classes";
import StudentSection from "../src/pages/Teachers/Students";
import TeacherSection from "../src/pages/Teachers/Teachers";
import CheckPerformanceSection from "../src/pages/Teachers/Performance";
import EventSection from "../src/pages/Teachers/Events";
import TeacherProfileSection from "../src/pages/Teachers/Profile";
import CheckAnnouncementSection from "../src/pages/Teachers/Announcement";
import AssignmentSection from "../src/pages/Teachers/Assignments";
import CheckAttendanceSection from "../src/pages/Teachers/Attendance";
import CheckExamSection from "../src/pages/Teachers/Exams";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/signin" element={<SignIn />} />

        {/*Dashboard routs */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />

        {/*Admin section here */}
        <Route path="/admin/classes" element={<Classes />} />
        <Route path="/admin/exams" element={<Exam />} />
        <Route path="/admin/attendance" element={<Attendance />} />
        <Route path="/admin/performance" element={<Performance />} />
        <Route path="/admin/teachers" element={<Teachers />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/assignments" element={<Assignments />} />
        <Route path="/admin/library" element={<Library />} />
        <Route path="/admin/communication" element={<Announcement />} />
        <Route path="/admin/events" element={<EventCalendar />} />
        <Route path="/admin/settings" element={<SettingsProfile />} />

        {/*All students routes*/}
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/exams" element={<ExamSection />} />
        <Route path="/student/performance" element={<PerformanceSection />} />
        <Route path="/student/attendance" element={<AttendanceSection />} />
        <Route path="/student/library" element={<LibrarySection />} />
        <Route
          path="/student/communication"
          element={<AnnouncementSection />}
        />
        <Route path="/student/settings" element={<ProfileSection />} />

        {/*All teacher routes  */}
        <Route path="/teacher/classes" element={<ClassSection />} />
        <Route path="/teacher/students" element={<StudentSection />} />
        <Route path="/teacher/teachers" element={<TeacherSection />} />
        <Route path="/teacher/assignments" element={<AssignmentSection />} />
        <Route path="/teacher/exams" element={<CheckExamSection />} />
        <Route
          path="/teacher/performance"
          element={<CheckPerformanceSection />}
        />
        <Route
          path="/teacher/attendance"
          element={<CheckAttendanceSection />}
        />
        <Route
          path="/teacher/communication"
          element={<CheckAnnouncementSection />}
        />
        <Route path="/teacher/events" element={<EventSection />} />
        <Route path="/teacher/settings" element={<TeacherProfileSection />} />
      </Routes>
    </Router>
  );
}

export default App;
