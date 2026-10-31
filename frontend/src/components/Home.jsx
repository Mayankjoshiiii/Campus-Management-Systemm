import React from "react";
import { useNavigate } from "react-router-dom";
import { HomeContainer, SchoolInfo, Title } from "../styles/AuthStyles";

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <SchoolInfo>
        <Title>Campus Management System</Title>
        <button onClick={() => navigate("/signin")}>Get Started</button>
      </SchoolInfo>
    </HomeContainer>
  );
};

export default Home;
