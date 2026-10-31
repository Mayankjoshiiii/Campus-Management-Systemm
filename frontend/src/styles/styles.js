// styles.js
import styled from 'styled-components'; // Correct
import { Link } from 'react-router-dom';

export const Navbar = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color:red;
  color: rgb(109, 64, 215);
  font-family: Arial, sans-serif;
  z-index: 1000;

  @media screen and (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;


export const Logo = styled.img`
  width: 50px;
  height: 50px; /* Set height equal to width for perfect circle */
  border-radius: 50%; /* This makes it round */
  object-fit: cover; /* Ensures the image fills the circle without distortion */

  @media screen and (max-width: 768px) {
    margin-bottom: 10px;
  }
`;

export const NavigationLinks = styled.div`
  display: flex;
  align-items: center;

  @media screen and (max-width: 768px) {
    margin-top: 10px;
  }
`;

export const NavLink = styled.a`
  margin-right: 20px;
  color: black;
  text-decoration: none;
  font-size: 18px;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }

  @media screen and (max-width: 768px) {
    margin: 0 10px;
    font-size: 16px;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-right: 35px;

  @media screen and (max-width: 768px) {
    margin-top: 10px;
    margin-right: 0;
  }
`;

export const LoginButton = styled.button`
  background-color: white;
  color: rgb(132, 12, 12);
  border: none;
  padding: 10px 20px;
  margin-right: 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  @media screen and (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

export const GuestButton = styled.button`
  color: rgb(132, 12, 12);
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  //border: 2px solid orange;
  border-radius: 5px;
  background-color: white;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: orange;
  }

  @media screen and (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`;

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  background: linear-gradient(45deg,);
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  padding-top: 80px;

  @media screen and (max-width: 768px) {
    padding-top: 60px;
  }
`;

export const SchoolInfo = styled.div`
  margin-top: 20px;
`;

export const SchoolImage = styled.div`
  position: relative; /* Needed for potential overlay */
  width: 100%;
  height: 80vh;
  background-image: ${props => props.bgImage ? `url(${props.bgImage})` : 'none'};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  margin-top: 20px;
  
  /* Semi-transparent overlay - better than opacity on whole container */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgb(34, 36, 141);; /* Adjust opacity here (0.3 = 30%) */
  }

  /* Content inside should be positioned above the overlay */
  & > * {
    position: relative;
    z-index: 1;
  }

  @media screen and (max-width: 768px) {
    height: 60vh; /* Often better for mobile */
  }
`;

export const Title = styled.h1`
  font-size: 45px;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.5);
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);

  @media screen and (max-width: 768px) {
    font-size: 28px;
  }
`;

export const LoremTextContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  font-size: 40px;
  color: white;
  text-align: justify;
  padding: 0 20px;

  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
`;

export const AdminRegisterLink = styled(Link)`
  color: white;
  font-size: 12px;
  font-weight: bold;
  text-decoration: none;
  margin-top: 10px;

  &:hover {
    text-decoration: underline;
  }

  @media screen and (max-width: 768px) {
    font-size: 10px;
  }
`;
