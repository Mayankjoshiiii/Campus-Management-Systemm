// EventCalendar.js
import React from 'react';
import Sidebar from './Sidebar';
import {
  EventCalendarContainer,
  Content,
  CalendarContainer,
} from '../../styles/EventCalendarStyles';

const EventCalendar = () => {
  return (
    <EventCalendarContainer>
      <Sidebar />
      <Content>
        <h1>Events & Calendar</h1>

        <CalendarContainer>
          {/* Default PDF shown here */}
          <iframe
            src="/public/classinfo.pdf"
            width="100%"
            height="600px"
            style={{ border: '1px solid #ccc', borderRadius: '8px' }}
            title="Class Info PDF"
          >
            This browser does not support PDFs.
            <a href="/assets/classinfo.pdf">Download PDF</a>.
          </iframe>
        </CalendarContainer>
      </Content>
    </EventCalendarContainer>
  );
};

export default EventCalendar;
