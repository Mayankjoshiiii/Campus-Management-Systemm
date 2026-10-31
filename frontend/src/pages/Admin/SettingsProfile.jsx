// SettingsProfile.js
import React from 'react';
import Sidebar from './Sidebar';
import {
  ProfileContainer,
  SidebarContainer,
  Content,
  ProfileHeader,
  ProfileDetails,
  ProfileLabel,
  ProfileInfo,
  EditButton,
} from '../../styles/SettingsProfileStyles'; // Import styled components from SettingsProfileStyles.js

const SettingsProfile = () => {
  const teacherInfo = {
    name: 'Graphic Era',
    address: 'Clement Town, Dehradun ,Uttarakhand',

  };

  return (
    <ProfileContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <Content>
        <ProfileHeader>Profile Details</ProfileHeader>
        <ProfileDetails>
          <ProfileLabel>Name:</ProfileLabel>
          <ProfileInfo aria-brailleroledescription=''>{teacherInfo.name}</ProfileInfo>
         
          <ProfileLabel>Address:</ProfileLabel>
          <ProfileInfo>{teacherInfo.address}</ProfileInfo>
        </ProfileDetails>
        {/* <EditButton>Edit Profile</EditButton> */}
      </Content>
    </ProfileContainer>
  );
};

export default SettingsProfile;
