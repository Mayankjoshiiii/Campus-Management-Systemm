// AssignmentSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './Sidebar';
import { AssignmentsContainer, Content, AssignmentsContent, AssignmentsHeader, AssignmentList, AssignmentItem, AddAssignmentForm, 
  AddAssignmentInput, AddAssignmentTextArea, AddAssignmentButton } from '../../styles/AssignmentsStyles'; 

const AssignmentSection = () => {

  return (
    <AssignmentsContainer>
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

export default AssignmentSection;
