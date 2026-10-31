import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  AuthContainer,
  FormContainer,
  InputField,
  SubmitButton,
  ErrorMessage,
  ResetLink,
  Title,
} from "../styles/AuthStyles";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" }, timeout: 2500 }
      );

      if (response.data.status === "success") {
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("adminToken", response.data.token);
        localStorage.setItem("userRole", response.data.role);
        localStorage.setItem("userEmail", response.data.email);
        localStorage.setItem("userName", response.data.name);

        const target = response.data.redirectUrl ||
          (response.data.role.toLowerCase() === "teacher" || response.data.role.toLowerCase() === "faculty"
            ? "/teacher/dashboard"
            : response.data.role.toLowerCase() === "student"
            ? "/student/dashboard"
            : "/admin/dashboard");

        navigate(target);
      } else {
        setError(response.data.message || "Invalid credentials");
      }
    } catch (err) {
      console.warn("Backend API unavailable or error:", err);

      // Seamless fallback for GitHub Pages demo mode when backend is offline
      if (email === "admin@university.edu" && password === "admin123") {
        localStorage.setItem("authToken", "demo-token-admin");
        localStorage.setItem("adminToken", "demo-token-admin");
        localStorage.setItem("userRole", "Admin");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", "University Admin (Live Demo)");
        navigate("/admin/dashboard");
        return;
      } else if (email === "faculty@university.edu" && password === "faculty123") {
        localStorage.setItem("authToken", "demo-token-faculty");
        localStorage.setItem("userRole", "Teacher");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", "Dr. Satya Prakash (Live Demo)");
        navigate("/teacher/dashboard");
        return;
      } else if (email === "student@university.edu" && password === "student123") {
        localStorage.setItem("authToken", "demo-token-student");
        localStorage.setItem("userRole", "Student");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", "Aman Verma (Live Demo)");
        navigate("/student/dashboard");
        return;
      }

      setError(
        err.response?.data?.message ||
        "Login failed. Please verify credentials or launch local backend via start-project.bat."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError("");
  };

  return (
    <AuthContainer>
      <Title>Campus Cloud University</Title>
      <FormContainer onSubmit={handleSignIn}>
        <InputField
          type="email"
          placeholder="University Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputField
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <SubmitButton type="submit" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </SubmitButton>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e2e8f0", width: "100%" }}>
          <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px 0", textAlign: "center", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Quick 1-Click Demo Logins
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => handleDemoLogin("admin@university.edu", "admin123")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                color: "#1e293b"
              }}
            >
              👑 Admin Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("faculty@university.edu", "faculty123")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                color: "#1e293b"
              }}
            >
              👨‍🏫 Teacher Demo
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("student@university.edu", "student123")}
              style={{
                padding: "6px 12px",
                fontSize: "12px",
                background: "#f1f5f9",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
                color: "#1e293b"
              }}
            >
              🎓 Student Demo
            </button>
          </div>
        </div>
      </FormContainer>
    </AuthContainer>
  );
};

export default SignIn;
