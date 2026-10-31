import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  BsGraphUp,
  BsPeople,
  BsPerson,
  BsFileText,
  BsBook,
  BsGraphDown,
  BsCalendar,
  BsGear,
  BsChatDots,
  BsCalendarEvent,
} from "react-icons/bs";
import bg1 from "../../assets/bg1.png";

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: ${({ $isOpen }) => ($isOpen ? "0" : "-250px")};
  width: 250px;
  height: 100%;
  background-color: rgb(34, 36, 141);
  color: white;
  overflow-y: auto;
  padding-top: 60px;
  transition: left 0.3s ease;
  z-index: 100;
`;

const SidebarHeader = styled.div`
  padding: 20px;
  font-size: 24px;
  font-weight: bold;
  text-align: center;
`;

const SidebarNav = styled.ul`
  list-style: none;
  padding: 0;
`;

const SidebarNavItem = styled.li`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  font-size: 18px;
  border-bottom: 1px solid #34495e;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #34495e;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  font-weight: bold;
  margin-left: 10px;
`;

const SidebarIcon = styled.div`
  margin-right: 10px;
`;

const Logo = styled.img`
  width: 50px;
  height: auto;
`;

const ToggleButton = styled.div`
  position: fixed;
  top: 20px;
  left: ${({ $isOpen }) => ($isOpen ? "250px" : "0")};
  width: 30px;
  height: 30px;
  background-color: #34495e;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: left 0.3s ease;
  z-index: 101;
`;

const ToggleIcon = styled.span`
  color: white;
  font-size: 20px;
  transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  transition: transform 0.3s ease;
`;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <SidebarContainer $isOpen={isOpen}>
        <SidebarHeader>
          <Logo src={bg1} alt="Logo" />
        </SidebarHeader>
        <SidebarNav>
          <SidebarNavItem>
            <SidebarIcon>
              <BsGraphUp />
            </SidebarIcon>
            <StyledLink to="/admin/dashboard">Dashboard</StyledLink>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarIcon>
              <BsPeople />
            </SidebarIcon>
            <StyledLink to="/admin/classes">Subjects</StyledLink>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarIcon>
              <BsPeople />
            </SidebarIcon>
            <StyledLink to="/admin/students">Students</StyledLink>
          </SidebarNavItem>
          <SidebarNavItem>
            <SidebarIcon>
              <BsPerson />
            </SidebarIcon>
            <StyledLink to="/admin/teachers">Teachers</StyledLink>
          </SidebarNavItem>

          <SidebarNavItem>
            <SidebarIcon>
              <BsChatDots />
            </SidebarIcon>
            <StyledLink to="/admin/communication">Announcement</StyledLink>
          </SidebarNavItem>
        </SidebarNav>
        <ToggleButton $isOpen={isOpen} onClick={toggleSidebar}>
          <ToggleIcon $isOpen={isOpen}>▲</ToggleIcon>
        </ToggleButton>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
