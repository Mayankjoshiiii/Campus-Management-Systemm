import styled from "styled-components";

export const AttendanceContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

export const SidebarContainer = styled.div`
  width: 250px;
  background-color: #2c3e50;
  color: white;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

export const AttendanceContent = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const AttendanceHeader = styled.h2`
  color: #2c3e50;
  margin-bottom: 20px;
  text-align: center;
`;

export const AttendanceList = styled.div`
  margin-top: 20px;
`;

export const AttendanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  margin-bottom: 10px;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #eee;
  }
`;

export const StudentName = styled.div`
  font-weight: bold;
  flex: 2;
`;

export const AttendanceDate = styled.div`
  flex: 1;
  color: #555;
`;

export const AttendanceSubject = styled.div`
  flex: 2;
  color: #444;
`;

export const AttendanceStatus = styled.div`
  flex: 1;
  text-align: center;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: bold;

  &.present {
    background-color: #d4edda;
    color: #155724;
  }

  &.absent {
    background-color: #f8d7da;
    color: #721c24;
  }
`;

export const CheckboxLabel = styled.label`
  margin-left: 15px;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  background-color: ${(props) => (props.disabled ? "#eee" : "transparent")};
  opacity: ${(props) => (props.disabled ? 0.7 : 1)};

  input {
    margin-right: 8px;
    cursor: pointer;
  }
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #ddd;
  margin: 5px 0;
`;

export const SubmitButton = styled.button`
  display: block;
  width: 200px;
  margin: 20px auto;
  padding: 10px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled.div`
  color: #e74c3c;
  background-color: #fadbd8;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  text-align: center;
`;

export const LoadingMessage = styled.div`
  color: #3498db;
  text-align: center;
  padding: 20px;
`;

export const EmptyMessage = styled.div`
  color: #7f8c8d;
  text-align: center;
  padding: 20px;
  font-style: italic;
`;

export const DatePicker = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
`;

export const SubjectSelector = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-right: 10px;
  min-width: 300px;
`;

export const SubjectFilter = styled.select`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin: 10px 0;
  width: 100%;
  max-width: 400px;
`;

export const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  padding: 15px;
  background-color: #f0f7ff;
  border-radius: 8px;
`;

export const StatsItem = styled.div`
  text-align: center;
`;

export const StatsTitle = styled.div`
  font-size: 14px;
  color: #7f8c8d;
  margin-bottom: 5px;
`;

export const StatsValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
`;
// In your AttendanceStyles.js file, add this component:

export const StudentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const AttendanceControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;
export const RemarksInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  flex: 1;
`;

export const RemarksText = styled.div`
  font-style: italic;
  color: #666;
  grid-column: 1 / -1;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #eee;
`;
