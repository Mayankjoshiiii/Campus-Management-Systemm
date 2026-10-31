import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  AnnouncementContainer,
  Content,
  Title,
  AnnouncementForm,
  FormGroup,
  Label,
  TextArea,
  Button,
  AnnouncementList,
  AnnouncementItem,
  AnnouncementContent,
} from "../../styles/AnnouncementStyles";

const Announcement = () => {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("General Announcement");
  const [announcements, setAnnouncements] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/admin/announcement", {
        title,
        message,
      });
      alert("Announcement sent successfully!");
      setMessage("");
      fetchAllAnnouncements();
    } catch (error) {
      console.error("Error sending announcement:", error);
      alert("Failed to send announcement");
    }
  };

  const fetchAllAnnouncements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/all/announcement"
      );
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/delete/Announcement/${id}`);
      fetchAllAnnouncements();
      alert("Announcement deleted successfully!");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      alert("Failed to delete announcement");
    }
  };

  useEffect(() => {
    fetchAllAnnouncements();
  }, []);

  return (
    <AnnouncementContainer>
      <Sidebar />
      <Content>
        <Title>Announcement</Title>

        <AnnouncementForm onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="announcement">Announcement:</Label>
            <TextArea
              required
              rows={4}
              cols={50}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </FormGroup>
          <Button type="submit">Send Announcement</Button>
        </AnnouncementForm>

        <h2>All Announcements</h2>
        <AnnouncementList>
          {announcements.length > 0 ? (
            announcements.map((item) => (
              <AnnouncementItem key={item.id}>
                <AnnouncementContent>
                  <strong>{item.title}</strong>
                  <p>{item.message}</p>
                  <Button onClick={() => handleDelete(item.id)}>Delete</Button>
                </AnnouncementContent>
              </AnnouncementItem>
            ))
          ) : (
            <p>No announcements yet.</p>
          )}
        </AnnouncementList>
      </Content>
    </AnnouncementContainer>
  );
};

export default Announcement;

