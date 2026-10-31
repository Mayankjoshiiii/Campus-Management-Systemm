// src/styles/TeachersStyles.js

import styled from 'styled-components';

export const TeachersContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const Content = styled.div`
  flex: 1;
  background-color: #f4f7fa;
`;

export const TeachersContent = styled.div`
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const TeachersHeader = styled.h2`
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 30px;
`;

export const AddTeacherForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const AddTeacherInput = styled.input`
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

export const AddTeacherButton = styled.button`
  padding: 12px 24px;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #0056b3;
  } 
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.p`
  color: #dc3545;
  font-size: 14px;
  margin-top: 10px;
`;