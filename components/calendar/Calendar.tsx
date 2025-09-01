// components/calendar/Calendar.tsx
"use client";
import { EventInput } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef, useImperativeHandle, forwardRef, useEffect } from "react";

interface CalendarProps {
  events: EventInput[];
  onDateClick?: (dateStr: string) => void;
  onEventClick?: (event: any) => void;
  initialView?: string;
  showHeader?: boolean;
}

const Calendar = forwardRef(function Calendar(
  {
    events,
    onDateClick,
    onEventClick,
    initialView = "dayGridMonth",
    showHeader = true,
  }: CalendarProps,
  ref
) {
  const calendarRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Gunakan useEffect untuk ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (calendarRef.current) {
        calendarRef.current.getApi().updateSize();
      }
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    updateSize: () => {
      calendarRef.current?.getApi().updateSize();
    },
  }));

  return (
    <div ref={containerRef} className="w-full h-full">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={initialView}
        events={events}
        eventClick={onEventClick}
        dateClick={(info) => onDateClick?.(info.dateStr)}
        headerToolbar={
          showHeader
            ? {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }
            : false
        }
        height="auto"
        contentHeight="auto"
        aspectRatio={1.5}
        initialDate={new Date()}
        locale="id"
        buttonText={{
          today: "Hari Ini",
          month: "Bulan",
          week: "Minggu",
          day: "Hari",
        }}
        themeSystem="standard"
        nowIndicator
        dayCellClassNames="hover:bg-gray-100 dark:hover:bg-gray-700"
      />
    </div>
  );
});

export default Calendar;