import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  ProfileContainer,
  SidebarContainer,
  Content,
  ProfileHeader,
  ProfileInfo,
  ProfileDetail,
  Label,
  Value,
  LoadingMessage,
  ErrorMessage,
  ProfileImageContainer,
  ProfileImage,
  UploadButton,
  ChangeImageButton,
  ImageInput,
  ButtonGroup,
  SuccessMessage,
} from "../../styles/SettingsProfileStyles";

const API_BASE_URL = "http://localhost:5000/api";

const ProfileSection = () => {
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Initialize from localStorage and fetch profile data
  useEffect(() => {
    // First check localStorage for cached image
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
      setImagePreview(savedImage);
    }

    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const email = localStorage.getItem("userEmail");

        // Fetch profile data
        const profileResponse = await axios.get(
          `${API_BASE_URL}/students/by-email/${email}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setStudentProfile(profileResponse.data);

        // Fetch fresh image if available
        if (profileResponse.data?.stuImage) {
          try {
            const imgResponse = await axios.get(
              `${API_BASE_URL}/students/profile-image/${email}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                responseType: "blob",
              }
            );

            // Create object URL from blob
            const blobUrl = URL.createObjectURL(imgResponse.data);
            setImagePreview(blobUrl);
            localStorage.setItem("profileImage", blobUrl);
          } catch (imgError) {
            console.warn(
              "Couldn't fetch fresh image, using cached version:",
              imgError
            );
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    // Cleanup function to revoke object URLs
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.match("image.*")) {
        setError("Please select an image file (JPEG, PNG)");
        return;
      }

      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB");
        return;
      }

      setError(null);
      setSelectedFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setError(null);
      setSuccess(null);

      const token = localStorage.getItem("authToken");
      const email = localStorage.getItem("userEmail");

      // Upload new image
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("email", email);

      await axios.post(`${API_BASE_URL}/students/upload-image`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Fetch the updated image as blob
      const imgResponse = await axios.get(
        `${API_BASE_URL}/students/profile-image/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      // Create and store new image URL
      const blobUrl = URL.createObjectURL(imgResponse.data);
      setImagePreview(blobUrl);
      localStorage.setItem("profileImage", blobUrl);

      // Refresh profile data
      const profileResponse = await axios.get(
        `${API_BASE_URL}/students/by-email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStudentProfile(profileResponse.data);

      setSuccess("Profile image updated successfully!");
      setSelectedFile(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error uploading image:", error);
      setError(
        error.response?.data?.message ||
          "Failed to upload image. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setError(null);
    // Reset to original image
    if (studentProfile?.stuImage) {
      // Fetch the original image again if needed
      const fetchOriginalImage = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const email = localStorage.getItem("userEmail");

          const imgResponse = await axios.get(
            `${API_BASE_URL}/students/profile-image/${email}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: "blob",
            }
          );

          const blobUrl = URL.createObjectURL(imgResponse.data);
          setImagePreview(blobUrl);
          localStorage.setItem("profileImage", blobUrl);
        } catch (err) {
          console.error("Error fetching original image:", err);
        }
      };

      fetchOriginalImage();
    } else {
      setImagePreview(null);
      localStorage.removeItem("profileImage");
    }
  };

  if (loading) return <LoadingMessage>Loading profile...</LoadingMessage>;
  if (error) return <ErrorMessage>{error}</ErrorMessage>;

  return (
    <ProfileContainer>
      <SidebarContainer>
        <Sidebar />
      </SidebarContainer>
      <Content>
        <ProfileHeader>Student Profile</ProfileHeader>
        {studentProfile ? (
          <>
            <ProfileImageContainer>
              <ProfileImage
                src={imagePreview || "/default-profile.png"}
                alt="Profile"
                onError={(e) => {
                  e.target.src = "/default-profile.png";
                }}
              />
              <div>
                <ImageInput
                  type="file"
                  id="profileImage"
                  accept="image/jpeg, image/png, image/jpg"
                  onChange={handleImageChange}
                />
                <ButtonGroup>
                  <ChangeImageButton htmlFor="profileImage">
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </ChangeImageButton>
                  {selectedFile && (
                    <>
                      <UploadButton
                        onClick={handleImageUpload}
                        disabled={isUploading}
                      >
                        {isUploading ? "Uploading..." : "Save"}
                      </UploadButton>
                      <UploadButton onClick={handleCancelUpload} cancel>
                        Cancel
                      </UploadButton>
                    </>
                  )}
                </ButtonGroup>
                {success && <SuccessMessage>{success}</SuccessMessage>}
              </div>
            </ProfileImageContainer>
            <ProfileInfo>
              <ProfileDetail>
                <Label>Name:</Label>
                <Value>{studentProfile.name || "N/A"}</Value>
              </ProfileDetail>
              <ProfileDetail>
                <Label>Email:</Label>
                <Value>{studentProfile.email || "N/A"}</Value>
              </ProfileDetail>
              <ProfileDetail>
                <Label>Roll Number:</Label>
                <Value>{studentProfile.rollNo || "N/A"}</Value>
              </ProfileDetail>
              <ProfileDetail>
                <Label>Course :</Label>
                <Value>{studentProfile.course || "N/A"}</Value>
              </ProfileDetail>
              <ProfileDetail>
                <Label>Department:</Label>
                <Value>{studentProfile.branch || "N/A"}</Value>
              </ProfileDetail>
              <ProfileDetail>
                <Label>Semester :</Label>
                <Value>{studentProfile.semester || "N/A"}</Value>
              </ProfileDetail>
              <ProfileDetail>
                <ProfileDetail>
                  <Label>DOB :</Label>
                  <Value>{studentProfile.dob || "N/A"}</Value>
                </ProfileDetail>
                <Label>Year :</Label>
                <Value>{studentProfile.year || "N/A"}</Value>
              </ProfileDetail>
              <ProfileDetail>
                <Label>University ID:</Label>
                <Value>{studentProfile.univId || "N/A"}</Value>
              </ProfileDetail>

              <ProfileDetail>
                <Label>Contact Number:</Label>
                <Value>{studentProfile.contactNo || "N/A"}</Value>
              </ProfileDetail>

              <ProfileDetail>
                <Label>Semester:</Label>
                <Value>{studentProfile.semester || "N/A"}</Value>
              </ProfileDetail>
            </ProfileInfo>
          </>
        ) : (
          <ErrorMessage>No profile data available</ErrorMessage>
        )}
      </Content>
    </ProfileContainer>
  );
};

export default ProfileSection;

