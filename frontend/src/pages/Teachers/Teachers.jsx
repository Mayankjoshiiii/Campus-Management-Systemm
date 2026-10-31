// TeacherSection.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
import { TeachersContainer, Content, TeachersContent, TeachersHeader, AddTeacherForm, AddTeacherInput, 
  AddTeacherButton } from '../../styles/TeachersStyles';

const TeacherSection = () => {
  return (
    <TeachersContainer>
      <Sidebar />
      <Content>
        <TeachersContent>
          <TeachersHeader>Teachers</TeachersHeader>
          <TeacherList>
          </TeacherList>
        </TeachersContent>
      </Content>
    </TeachersContainer>
  );
};

export default TeacherSection;
