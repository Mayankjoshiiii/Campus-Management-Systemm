import styled from "styled-components";

// Main container for auth pages
export const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 2rem;
`;

// Form styling
export const FormContainer = styled.form`
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
  }
`;

// Input field styling
export const InputField = styled.input`
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 1.2rem;
  border: 2px solid #e0e6ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    border-color: #4361ee;
    outline: none;
    box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.2);
  }

  &::placeholder {
    color: #9aa5b1;
  }
`;

// Submit button
export const SubmitButton = styled.button`
  width: 100%;
  padding: 12px;
  background-color: #4361ee;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background-color: #3a56d4;
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #9aa5b1;
    cursor: not-allowed;
    transform: none;
  }
`;

// Error message styling
export const ErrorMessage = styled.div`
  color: #d90429;
  background-color: #ffd6d6;
  padding: 12px;
  border-radius: 8px;
  margin: 1rem 0;
  font-size: 0.9rem;
  text-align: center;
`;

// Password reset link
export const ResetLink = styled.span`
  display: block;
  text-align: center;
  margin-top: 1rem;
  color: #4361ee;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;

  &:hover {
    color: #3a56d4;
  }
`;

// Title styling
export const Title = styled.h1`
  color: #2b2d42;
  margin-bottom: 2rem;
  font-size: 2rem;
  text-align: center;
  font-weight: 700;
  background: linear-gradient(to right, #4361ee, #3a0ca3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

// Home page container
export const HomeContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
`;

// School image background
export const SchoolImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

// School info card
export const SchoolInfo = styled.div`
  position: relative;
  z-index: 10;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 700px;
  text-align: center;
  margin: 2rem;

  button {
    background-color: #4361ee;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;

    &:hover {
      background-color: #3a56d4;
      transform: translateY(-2px);
    }
  }
`;

// Dashboard styles
export const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
`;

export const Content = styled.div`
  flex: 1;
  padding: 2rem;
`;

export const ProfileCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 0 auto;

  h2 {
    color: #2b2d42;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  p {
    color: #4b5563;
    margin-bottom: 0.8rem;
    font-size: 1rem;
  }
`;
//
