import { createBrowserRouter } from "react-router-dom";

// Auth
import Login from "../public/pages/Login";
import Register from "../public/pages/Register";

// Shared
import ProtectedRoute from "../shared/components/ProtectedRoute";
import Courses from "../public/pages/Courses";
import Contact from "../public/pages/Contact";
import CourseDetails from "../public/pages/CourseDetails";
import PageNotFound from "../public/pages/PageNotFound";
// Student
import StudentLayout from "../student/layout/StudentLayout";
import Dashboard from "../student/pages/Dashboard";
import MyCourses from "../student/pages/MyCourses";
import StudentCertificates from "../student/pages/Certificates";
import StudentProfile from "../student/pages/Profile";
import StudentSecurity from "../student/pages/Security";
import StudentHistory from "../student/pages/History";
import WatchCourse from "../student/pages/WatchCourse";
export const router = createBrowserRouter([

  // 🔐 Root "/"
  {
    path: "/",
    element: <ProtectedRoute role="student" />,
    children: [
      {
        element: <StudentLayout />,
        children: [ 
          { index: true, element: <Dashboard /> },
          { path: "my-courses", element: <MyCourses /> },
          { path: "certificates", element: <StudentCertificates /> },
          { path: "profile", element: <StudentProfile /> },
          { path: "security", element: <StudentSecurity /> },
          { path: "history", element: <StudentHistory /> },
          { path: "watch/:courseId", element: <WatchCourse /> },
        ],
      },
    ],
  },

  // 🔐 "/student" alias (same layout)
  {
    path: "/student",
    element: <ProtectedRoute role="student" />,
    children: [
      {
        element: <StudentLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "my-courses", element: <MyCourses /> },
          { path: "certificates", element: <StudentCertificates /> },
          { path: "profile", element: <StudentProfile /> },
          { path: "security", element: <StudentSecurity /> },
          { path: "history", element: <StudentHistory /> },
          { path: "watch/:courseId", element: <WatchCourse /> },
        ],
      },
    ],
  },

  // 🔓 Auth
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  // 🌐 Optional public courses
  { path: "/courses", element: <Courses /> },
  { path: "contact", element: <Contact /> },
  { path: "courses/:courseId", element: <CourseDetails /> },
  { path: "course/:courseId", element: <CourseDetails /> },
  // ❌ Fallback
  {
    path: "*",
    element: <PageNotFound />,
  },
]);