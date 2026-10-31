import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AssignmentsContainer,
  Content,
  AssignmentsContent,
  AssignmentsHeader,
  AssignmentList,
  AssignmentItem,
  AddAssignmentForm,
  AddAssignmentInput,
  AddAssignmentTextArea,
  AddAssignmentButton,
} from '../../styles/AssignmentsStyles';

const Assignments = () => {
  return (
    <AssignmentsContainer>
      <ToastContainer />
      <Sidebar />
      <Content>
        <AssignmentsContent>
          <AssignmentsHeader>Assignments</AssignmentsHeader>
          <AddAssignmentForm >
            <AddAssignmentInput
              type="text"
              placeholder="Enter assignment title"
        
            />
            <AddAssignmentTextArea
              placeholder="Enter assignment description"
             
            />
            <AddAssignmentInput
              type="text"
              placeholder="Enter assignment grade"
             
            />
            <AddAssignmentInput
              type="text"
              placeholder="Enter assignment deadline"
             
            />
            <AddAssignmentButton type="submit">Add Assignment</AddAssignmentButton>
          </AddAssignmentForm>
          <AssignmentList>
          </AssignmentList>
        </AssignmentsContent>
      </Content>
    </AssignmentsContainer>
  );
};

export default Assignments;
