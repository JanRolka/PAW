import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";
import { useEffect, useRef, useState } from "react";
import { deleteVisit } from "../../backend/Services";

function WeeklyCalendar({ events, role }) {
  const dialogRef = useRef(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const calendarEvents = events.map((event) => {
    console.log(event)

    if (event.type === "absence") {
      return {
        id: event.id,
        start: event.date,
        allDay: true,
        display: "background",
        backgroundColor: "#ff4d4f",
        borderColor: "#ff4d4f",
        extendedProps: { type: "absence" }
      };
    }

    if (event.type === "access") {
      return {
        id: event.id,
        start: event.start,
        end: event.end,
        display: "background",
        backgroundColor: "#52c41a",
        borderColor: "#52c41a",
        extendedProps: { type: "access" }
      };
    }

    if (event.type === "visit") {
      return {
        id: event.id,
        title: "Wizyta",
        start: event.start,
        end: event.end,
        backgroundColor: "#0a1ed6ff",
        borderColor: "#0a1ed6ff",
        description: event.description,
        doctorName: event.doctorName
      };
    }

    return event;
  });

  useEffect(() => {
    if (selectedEvent && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [selectedEvent]);

  const closeDialog = () => {
    dialogRef.current?.close();
    setSelectedEvent(null);
  };

  const cancelVisit = (visitId) => {
    try {
      deleteVisit(visitId)
    } catch (err) {
      console.error("Failed to delete visit:", err);
    }
  }

  return (
    <>
      <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        locale={plLocale}
        height="auto"
        slotMinTime="09:00:00"
        slotMaxTime="20:00:00"
        slotDuration="00:30:00"
        selectable={true}
        events={calendarEvents}
        eventClick={(info) => setSelectedEvent(info.event)}
      />

      {/* Native dialog */}
      <dialog ref={dialogRef} onClose={closeDialog} style={dialogStyle}>
        {selectedEvent && (
          <>
            <h3 style={{ marginTop: 0 }}>Szczegóły wizyty</h3>

            <p><strong>Początek:</strong> {selectedEvent.start.toLocaleString()}</p>
            <p><strong>Koniec:</strong> {selectedEvent.end?.toLocaleString()}</p>
            <p><strong>Lekarz:</strong> {selectedEvent.extendedProps.doctorName}</p>

            {selectedEvent?.description && (
              <p>
                <strong>Opis:</strong>{" "}
                {selectedEvent.description}
              </p>
            )}

            <div style={{ marginTop: "1rem", textAlign: "right" }}>
              <button onClick={() => cancelVisit(selectedEvent.id)}>Odwołaj wizytę</button>
              {role == "patient" && (
                <button onClick={closeDialog}>Zamknij</button>
              )}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}

/* Minimal dialog styling */
const dialogStyle = {
  padding: "1rem 1.5rem",
  borderRadius: "8px",
  border: "none",
  minWidth: "320px",
  color: "white",
};

export default WeeklyCalendar;




