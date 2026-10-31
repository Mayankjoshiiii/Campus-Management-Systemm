import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  AnnouncementContainer,
  Content,
  Title,
  AnnouncementList,
  AnnouncementItem,
  AnnouncementContent,
} from "../../styles/AnnouncementStyles";

const StudentAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://localhost:5000/api/all/announcement",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAnnouncements(response.data);
    } catch (error) {
      setError("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <AnnouncementContainer>
      <Sidebar />
      <Content>
        <Title>Announcements</Title>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <AnnouncementList>
          {announcements.length > 0
            ? announcements.map((item) => (
                <AnnouncementItem key={item.id}>
                  <AnnouncementContent>
                    <h3>{item.title}</h3>
                    <p>{item.message}</p>
                  </AnnouncementContent>
                </AnnouncementItem>
              ))
            : !loading && <p>No announcements available</p>}
        </AnnouncementList>
      </Content>
    </AnnouncementContainer>
  );
};

export default StudentAnnouncement;

