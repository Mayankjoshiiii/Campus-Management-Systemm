// SettingsProfileStyles.js
import styled from "styled-components";

export const ProfileContainer = styled.div`
  display: flex;
`;

export const SidebarContainer = styled.div`
  flex: 0 0 250px;
`;

export const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

export const ProfileHeader = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;
export const ErrorMessage = styled.div`
  padding: 1rem;
  background: #ffebee;
  color: #c62828;
  border-radius: 4px;
  margin: 1rem 0;
  border-left: 4px solid #c62828;
`;

export const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #666;
`;
export const ProfileImageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
`;

export const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ddd;
`;

export const UploadButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
  font-size: 0.9rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

export const ChangeImageButton = styled.label`
  background-color: #2196f3;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0b7dda;
  }
`;

export const ImageInput = styled.input`
  display: none;
`;
export const ProfileDetails = styled.div`
  max-width: 400px;
`;

export const ProfileLabel = styled.label`
  font-weight: bold;
`;

export const ProfileInfo = styled.p`
  margin-bottom: 10px;
`;

export const EditButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export const ProfileDetail = styled.div`
  margin-bottom: 20px;
`;

export const Label = styled.span`
  font-weight: bold;
`;

export const Value = styled.span`
  margin-left: 10px;
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

export const SuccessMessage = styled.div`
  color: #28a745;
  margin-top: 10px;
  font-size: 14px;
`;
