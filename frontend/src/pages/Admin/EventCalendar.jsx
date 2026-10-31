// EventCalendar.js
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import {
  EventCalendarContainer,
  Content,
  CalendarContainer,
  Events,
  Event,
  AddEventForm,
  EventInput,
  AddEventButton,
  ErrorText,
} from "../../styles/EventCalendarStyles";

const EventCalendar = () => {
  return (
    <EventCalendarContainer>
      <Sidebar />
      <Content>
        <h1>Events & Calendar</h1>
        {/* */}
      </Content>
    </EventCalendarContainer>
  );
};

export default EventCalendar;
