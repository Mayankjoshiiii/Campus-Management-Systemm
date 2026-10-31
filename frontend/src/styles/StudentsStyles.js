import styled from "styled-components";

export const StudentsContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f0f2f5;
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: #fff;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

export const FeedbackMessage = styled.div`
  padding: 12px 16px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 14px;
  font-weight: 500;
  background-color: ${(props) => {
    switch (props.variant) {
      case "success":
        return "#d4edda";
      case "error":
        return "#f8d7da";
      case "warning":
        return "#fff3cd";
      default:
        return "#e2e3e5";
    }
  }};
  color: ${(props) => {
    switch (props.variant) {
      case "success":
        return "#155724";
      case "error":
        return "#721c24";
      case "warning":
        return "#856404";
      default:
        return "#383d41";
    }
  }};
  border: 1px solid
    ${(props) => {
      switch (props.variant) {
        case "success":
          return "#c3e6cb";
        case "error":
          return "#f5c6cb";
        case "warning":
          return "#ffeeba";
        default:
          return "#d6d8db";
      }
    }};
`;
export const Content = styled.div`
  flex: 1;
  padding: 24px;
  margin-left: 250px;
  background-color: #f5f7fa;
  overflow-y: auto;
`;

export const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 8px;
`;

export const LoadingMessage = styled.p`
  color: #666;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
`;
export const StudentInfo = styled.div`
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 12px;
`;
export const StudentLabel = styled.label`
  font-weight: bold;
  margin-right: 8px;
  display: inline-block;
  margin-bottom: 4px;
  color: #333;
`;
export const StudentValue = styled.p`
  margin: 0 0 10px 0;
  color: #555;
  font-size: 15px;
`;

export const StudentsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

export const StudentsHeader = styled.h1`
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  padding-bottom: 10px;
  border-bottom: 2px solid #eaecef;
`;

export const AddStudentForm = styled.form`
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
`;

export const FormSection = styled.div`
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;

  h3 {
    color: #2c3e50;
    font-size: 18px;
    margin-bottom: 15px;
  }
`;

export const FormRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 15px;

  & > div {
    flex: 1;
  }

  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #495057;
  }
`;

export const AddStudentInput = styled.input`
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

export const AddStudentButton = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

export const FileUploadContainer = styled.div`
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;

  input[type="file"] {
    margin-bottom: 15px;
    width: 100%;
  }

  p {
    color: #6c757d;
    margin-bottom: 15px;
    font-size: 14px;
  }
`;

export const StudentList = styled.div`
  background-color: #ffffff;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

export const StudentItem = styled.div`
  padding: 15px;
  border: 1px solid #eaecef;
  border-radius: 6px;
  margin-bottom: 15px;
  transition: box-shadow 0.3s;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  strong {
    color: #2c3e50;
    font-weight: 600;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#3498db" : "#e9ecef")};
  color: ${({ active }) => (active ? "white" : "#495057")};
  transition: all 0.3s;

  &:hover {
    background-color: ${({ active }) => (active ? "#2980b9" : "#dee2e6")};
  }
`;
