"use client";

import momentTimezonePlugin from "@fullcalendar/moment-timezone";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import iCalendarPlugin from "@fullcalendar/icalendar";

type CalendarProps = {
  id: string;
  params: Record<string, string>
};

export default function Calendar({ id, params }: CalendarProps) {
  return (
    <div className="h-screen">
      <FullCalendar
        plugins={[
          interactionPlugin,
          dayGridPlugin,
          timeGridPlugin,
          listPlugin,
          momentTimezonePlugin,
          iCalendarPlugin,
        ]}
        initialView="dayGridMonth"
        firstDay={1}
        navLinks={true}
        timeZone="Europe/Warsaw"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={{
          url: `/api/calendar/${id}?${new URLSearchParams(params).toString()}`,
          format: "ics",
        }}
        locale="pl"
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: false,
        }}
      />
    </div>
  );
}
