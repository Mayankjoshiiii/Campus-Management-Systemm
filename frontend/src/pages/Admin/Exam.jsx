// Exam.js
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import {
  ExamContainer,
  SidebarContainer,
  Content,
  ExamHeader,
  ExamForm,
  FormLabel,
  FormInput,
  AddButton,
} from '../../styles/ExamStyles';

const Exam = () => {
  const [examData, setExamData] = useState([]);
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [className, setClassName] = useState('');
  const [marks, setMarks] = useState('');

  const handleAddExam = (e) => {
    e.preventDefault();
    const newExam = {
      name,
      registrationNumber,
      className,
      marks: parseInt(marks),
    };
    setExamData([...examData, newExam]);
    setName('');
    setRegistrationNumber('');
    setClassName('');
    setMarks('');
  };

  const calculateTotalMarks = () => {
    return examData.reduce((total, exam) => total + exam.marks, 0);
  };

  return (
    <ExamContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <Content>
        <ExamHeader>Exam Details</ExamHeader>
        <ExamForm onSubmit={handleAddExam}>
          <FormLabel>Name:</FormLabel>
          <FormInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <FormLabel>Registration Number:</FormLabel>
          <FormInput
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            required
          />
          <FormLabel>Class:</FormLabel>
          <FormInput
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            required
          />
          <FormLabel>Marks:</FormLabel>
          <FormInput
            type="number"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            required
          />
          <AddButton type="submit">Add Exam</AddButton>
        </ExamForm>

        <h2>Total Marks: {calculateTotalMarks()}</h2>
        <h3>Exam Details:</h3>
        <ul>
          {examData.map((exam, index) => (
            <li key={index}>
              Name: {exam.name}, Reg No: {exam.registrationNumber}, Class: {exam.className}, Marks: {exam.marks}
            </li>
          ))}
        </ul>
      </Content>
    </ExamContainer>
  );
};

export default Exam;
