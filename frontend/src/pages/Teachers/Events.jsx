// EventCalendar.js
import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import axios from 'axios';
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
} from '../../styles/EventCalendarStyles';

const EventCalendar = () => {
  return (
    <EventCalendarContainer>
      <Sidebar />
      <Content>
        <h1>Events & Calendar</h1>
        {/* */}

        <CalendarContainer>
          {/* Display Calendar Here */}
          Calendar

          {/* PDF Viewer */}
          <div style={{ marginTop: '20px' }}>
            <h2>Academic Calendar PDF</h2>
            <iframe
              src="/academic-calendar.pdf"
              width="100%"
              height="600px"
              style={{ border: '1px solid #ccc', borderRadius: '8px' }}
              title="Academic Calendar"
            >
              This browser does not support PDFs.
              <a href="/academic-calendar.pdf">Download PDF</a>.
            </iframe>
          </div>
        </CalendarContainer>

        {/* <AddEventForm>
          <h2>Add New Event</h2>
          <EventInput
            type="text"
            placeholder="Enter Event"
          />
          <AddEventButton type="submit">Add Event</AddEventButton>
        </AddEventForm> */}

        {/* <Events>
          <h2>event</h2>
        </Events> */}
      </Content>
    </EventCalendarContainer>
  );
};

export default EventCalendar;
