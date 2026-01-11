import { useNavigate } from "react-router-dom";
import WeeklyCalendar from "./Calendars/WeeklyCalendar";
import BookingCalendar from "./Calendars/BookingCalendar";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import { getVisitsByPatient, getDoctors, getAccessByDoctor, logoutUser } from "../backend/Services";
import { translateSpecialization } from "./helpers/helpers";
import { Calendar, User, LogOut } from "lucide-react";
import styles from "../styles/Home.module.css";

function Patient() {
  const [events, setEvents] = useState([]);
  const [isVisitsModalOpen, setIsVisitsModalOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [doctorAccess, setDoctorAccess] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const patientId = user?.id;

  const navigate = useNavigate();

  const loadVisits = async () => {
    if (!user) return;
    try {
      const visits = await getVisitsByPatient(patientId);
      setEvents(visits);
    } catch (err) {
      console.error("Failed to load visits:", err);
    }
  };

  const loadDoctors = async () => {
    if (!user) return;
    try {
      const doctors = await getDoctors();
      setDoctors(doctors);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    }
  };

  const loadDoctorAccess = async (doctorId) => {
    try {
      const access = await getAccessByDoctor(doctorId);
      setDoctorAccess(access);
    } catch (err) {
      console.error("Failed to load doctor access:", err);
    }
  };

  useEffect(() => {
    loadVisits();
    loadDoctors();
  }, [patientId]);

  const handleVisits = async () => {
    setIsVisitsModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await logoutUser(); // log out from Firebase Auth
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
      localStorage.removeItem("userId");
      navigate("/"); // redirect to login page
    } catch (err) {
      alert("Logout failed: " + err.message);
      console.error("Logout error:", err);
    }
  };

  if (!user) {
    return <div>Please log in</div>;
  }

  return (
    <main>
      <nav>
        <h3>E - NFZ</h3>
        <h4>Główne Menu</h4>

        <div className={styles.menuItem} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Calendar size={20} />
          <span className={styles.label}>Kalendarz</span>
        </div>

        <div className={styles.menuItem} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <User size={20} />
          <span className={styles.label}>Dane osobowe</span>
        </div>

        {/* ✅ Logout button with icon */}
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              backgroundColor: "#f44336",
              color: "#fff",
              border: "none",
              borderRadius: "4px"
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>
      <div style={{ padding: "1rem", backgroundColor: "white", color: "black" }}>
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={handleVisits}>
            Umów wizytę
          </button>
        </div>

        <Modal
          isOpen={isVisitsModalOpen}
          onClose={() => {
            setIsVisitsModalOpen(false);
            setSelectedDoctor(null);
            setDoctorAccess([]);
          }}
        >
          {!selectedDoctor && (
            <>
              <h3>Wybierz lekarza</h3>

              {doctors.length === 0 && <p>Brak lekarzy</p>}

              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", color: "black" }}>
                {doctors.map((doctor) => (
                  <button
                    key={doctor.id}
                    onClick={async () => {
                      setSelectedDoctor(doctor);
                      await loadDoctorAccess(doctor.id);
                    }}
                    style={{
                      padding: "0.5rem",
                      textAlign: "left",
                      border: "1px solid #ccc",
                      backgroundColor: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    <h3>{doctor.surname}</h3>
                    <div style={{ fontSize: "0.9rem", color: "#666" }}>
                      {translateSpecialization(doctor.specialization) || "—"}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {selectedDoctor && (
            <>
              <h3>
                Dostępność lekarza: {selectedDoctor.surname}
              </h3>

              <BookingCalendar
                selectedDoctor={selectedDoctor}
                events={doctorAccess}
                onConfirm={(slot) => {
                  alert(
                    `Selected visit:\n${slot.start.toLocaleString()} – ${slot.end.toLocaleString()}`
                  );
                }}
              />


              <div style={{ marginTop: "1rem" }}>
                <button onClick={() => setSelectedDoctor(null)}>
                  Zmień lekarza
                </button>
              </div>
            </>
          )}
        </Modal>
        <WeeklyCalendar events={events} role={"patient"} />
      </div>
    </main>
  );
}

export default Patient;
