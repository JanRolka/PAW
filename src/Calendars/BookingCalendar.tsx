import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import plLocale from "@fullcalendar/core/locales/pl";
import { addVisit } from "../../backend/Services"

function BookingCalendar({ selectedDoctor, events, onConfirm }) {
    const [startSlot, setStartSlot] = useState(null);
    const [endSlot, setEndSlot] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));
    const patientId = user?.id;

    const calendarEvents = events.map(event => {
        if (event.type === "access") {
            return {
                id: `access-${event.start}`,
                start: event.start,
                end: event.end,
                backgroundColor: "#52c41a",
                borderColor: "#52c41a",
                extendedProps: { type: "access" }
            };
        }
        return null;
    }).filter(Boolean);

    const handleEventClick = (info) => {
        if (info.event.extendedProps?.type !== "access") return;

        const clickedStart = info.event.start;
        const clickedEnd = info.event.end;

        if (!startSlot) {
            setStartSlot(clickedStart);
            setEndSlot(clickedEnd);
            return;
        }

        if (clickedStart < startSlot) {
            alert("Początek wizyty musi być przed jego końcem");
            return;
        }

        setEndSlot(clickedEnd);
    };

    const handleConfirm = async () => {
        if (!startSlot || !endSlot || !selectedDoctor || !user) return;

        try {
            const startDateObj = new Date(startSlot);
            const endDateObj = new Date(endSlot);

            const date = startDateObj.toISOString().slice(0, 10);
            const start = startDateObj.toTimeString().slice(0, 5);
            const end = endDateObj.toTimeString().slice(0, 5);

            await addVisit({
                patient: patientId,
                doctor: selectedDoctor.id,
                date: date,
                start: start,
                end: end
            });

            alert("Wizyta zarezerwowana pomyślnie");

            setStartSlot(null);
            setEndSlot(null);
        } catch (err) {
            console.error(err);
            alert("Nie udało się zarezerwować wizyty");
        }
    };

    return (
        <>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                locale={plLocale}
                slotMinTime="09:00:00"
                slotMaxTime="20:00:00"
                slotDuration="00:30:00"
                events={calendarEvents}
                eventClick={handleEventClick}
            />

            {startSlot && (
                <div style={{ marginTop: "1rem" }}>
                    <strong>Wybrano:</strong>{" "}
                    {startSlot.toLocaleTimeString()} –{" "}
                    {endSlot?.toLocaleTimeString()}
                    <br />
                    <button onClick={handleConfirm}>Potwierdź wizytę</button>
                    <button onClick={() => {
                        setStartSlot(null);
                        setEndSlot(null);
                    }}>
                        Reset
                    </button>
                </div>
            )}
        </>
    );
}

export default BookingCalendar;
