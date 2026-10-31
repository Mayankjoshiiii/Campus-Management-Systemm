// ChooseUserStyles.js
import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const ChooseUserContainer = styled.div`
  display: flex;
  flex-direction: column; /* Stack children vertically */
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f5f5, #dcdcdc);
`;

// ChooseUserStyles.js

export const UserSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
  padding: 40px;
  width: 400px;
  border: 5px solid #ccc;
  border-radius: 10px;
  background-color:#ffcf33;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
`;


export const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

export const Button = styled(Link)`
  padding: 10px 20px;
  background-color: rgb(132, 12, 12);
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgb(132, 12, 12);
  }
`;
