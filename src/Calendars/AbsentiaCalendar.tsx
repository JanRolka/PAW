import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";

function AbsentiaCalendar({ absences = [], onAddAbsence, onRemoveAbsence }) {
  const [selectedDate, setSelectedDate] = useState(null);

  // Normalize date to YYYY-MM-DD
  const normalizeDate = (date) => {
    if (!date) return null;

    if (date instanceof Date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }

    if (typeof date === "string") {
      if (date.split("-")[0].length === 2) {
        const [day, month, year] = date.split("-");
        return `${year}-${month}-${day}`;
      }
      return date; // assume already YYYY-MM-DD
    }

    throw new Error("Invalid date format");
  };

  // Map absences to calendar events
  const absenceEvents = absences.map(a => ({
    start: normalizeDate(a.date),
    allDay: true,
    display: "background",
    backgroundColor: "#ff4d4f"
  }));

  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr); // always YYYY-MM-DD
  };

  const handleConfirm = () => {
    if (!selectedDate) return;

    const alreadyAbsent = absences.some(
      a => normalizeDate(a.date) === selectedDate
    );

    if (alreadyAbsent && onRemoveAbsence) {
      onRemoveAbsence(selectedDate);
    } else if (!alreadyAbsent && onAddAbsence) {
      onAddAbsence(selectedDate);
    }

    setSelectedDate(null); // reset selection after confirming
  };

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={plLocale}
        height="auto"
        events={absenceEvents}
        dateClick={handleDateClick}
        dayCellClassNames={(arg) =>
          arg.dateStr === selectedDate ? "selected-day" : ""
        }
      />

      <button
        onClick={handleConfirm}
        disabled={!selectedDate}
        style={{ marginTop: "1rem" }}
      >
        Potwierdź
      </button>
    </div>
  );
}

export default AbsentiaCalendar;

