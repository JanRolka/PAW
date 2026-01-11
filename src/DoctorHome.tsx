import { useState, useEffect } from "react";
import Modal from "./Modal";
import WeeklyCalendar from "./Calendars/WeeklyCalendar";
import AbsentiaCalendar from "./Calendars/AbsentiaCalendar.js";
import DoctorAvailability from "./DoctorAvailability";
import {
  getAbsentDaysByDoctor,
  addAbsentDay,
  deleteAbsentDay,
  getAccessByDoctor
} from "../backend/Services";
import { translateSpecialization } from "./helpers/helpers.js"
import styles from "../styles/Home.module.css";

function Doctor() {
  const [events, setEvents] = useState([]);
  const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [specialization, setSpecialization] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const doctorId = user?.id;

  const loadAbsences = async () => {
    if (!doctorId) return;
    try {
      const absences = await getAbsentDaysByDoctor(doctorId);
      setEvents(absences);
    } catch (err) {
      console.error("Failed to load absences:", err);
    }
  };

  const loadAccess = async () => {
    const accessEvents = await getAccessByDoctor(doctorId);
    setEvents(prev => [...prev.filter(e => e.type !== "access"), ...accessEvents]);
  };

  useEffect(() => {
    setSpecialization(translateSpecialization(user.specialization))

    loadAbsences();
    loadAccess();

  }, [doctorId]);

  const handleAddAbsence = async (date) => {
    if (!doctorId || !date) return;
    try {
      await addAbsentDay(doctorId, date);
      setIsAbsenceModalOpen(false);
      await loadAbsences();
    } catch (err) {
      console.error("Failed to add absence:", err);
    }
  };

  const handleRemoveAbsence = async (date) => {
    if (!doctorId || !date) return;
    try {
      await deleteAbsentDay(doctorId, date);
      setIsAbsenceModalOpen(false);
      await loadAbsences();
    } catch (err) {
      console.error("Failed to remove absence:", err);
    }
  };

  return (
    <main>
      <nav>
        <h3>E - NFZ</h3>
        <h4>Główne Menu</h4>
        <div className={styles.menuItem}>
          <img src="../icons/calendar.svg" alt="" />
          <span className={styles.label}>Kalendarz</span>
        </div>
        <div className={styles.menuItem}>
          <img src="../icons/user.svg" alt="" />
          <span className={styles.label}>Dane osobowe</span>
        </div>
        <div>
            <h4>Jan Lekarski</h4>
            <h6>{specialization}</h6>
        </div>
      </nav>

      <div style={{ padding: "1rem", backgroundColor: "white"}}>
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={() => setIsAbsenceModalOpen(true)}>
            Zarządzanie absencjami
          </button>
          <button
            onClick={() => setIsAvailabilityModalOpen(true)}
            style={{ marginLeft: "1rem" }}
          >
            Zarządzanie dostępnością
          </button>
        </div>

        <WeeklyCalendar events={events} role={"doctor"}/>

        <Modal
          isOpen={isAbsenceModalOpen}
          onClose={() => setIsAbsenceModalOpen(false)}
        >
          <h3>Dodawanie / Usuwanie absencji</h3>
          <AbsentiaCalendar
            absences={events}
            onAddAbsence={handleAddAbsence}
            onRemoveAbsence={handleRemoveAbsence}
          />
        </Modal>

        <Modal
          isOpen={isAvailabilityModalOpen}
          onClose={() => setIsAvailabilityModalOpen(false)}
        >
          <h3>Zarządzanie dostępnością</h3>
          <DoctorAvailability doctorId={doctorId} />
        </Modal>
      </div>
    </main>
  );
}

export default Doctor;
