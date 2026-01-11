import { useState } from "react";
import { addAccess, deleteAccess } from "../backend/Services";
import styles from "../styles/DoctorAvailability.module.css";

function DoctorAvailability({ doctorId }) {
  const [adding, setAdding] = useState(true)
  const [step, setStep] = useState(1);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const weekdays = [
    { label: "Pon", value: 1 },
    { label: "Wt", value: 2 },
    { label: "Śr", value: 3 },
    { label: "Czw", value: 4 },
    { label: "Pt", value: 5 },
    { label: "Sob", value: 6 },
    { label: "Nie", value: 0 }
  ];

  const [selectedWeekdays, setSelectedWeekdays] = useState([]);
  const [selectedHours, setSelectedHours] = useState([]);

  const hoursList = [];
  for (let h = 9; h <= 20; h++) {
    hoursList.push(`${String(h).padStart(2, "0")}:00`);
    if (h !== 20) hoursList.push(`${String(h).padStart(2, "0")}:30`);
  }

  const toggle = (value, setter) =>
    setter(prev => prev.includes(value)
      ? prev.filter(v => v !== value)
      : [...prev, value]
    );

  const getDatesInRange = () => {
    const dates = [];
    let current = new Date(startDate);
    const end = new Date(endDate);

    while (current <= end) {
      if (selectedWeekdays.includes(current.getDay())) {
        dates.push(current.toISOString().slice(0, 10));
      }
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const handleSave = async () => {
    if (!doctorId) return alert("Doctor not selected");

    try {
      const dates = getDatesInRange();

      for (const date of dates) {
        await addAccess(doctorId, date, selectedHours);
      }

      alert("Zapisano");
      setStep(1);
      setSelectedWeekdays([]);
      setSelectedHours([]);
      setStartDate("");
      setEndDate("");

    } catch (err) {
      console.error(err);
      alert("Błąd!");
    }
  };

  const handleRemoving = async () => {
    if (!doctorId) return alert("Doctor not selected");

    try {
      const dates = getDatesInRange();

      for (const date of dates) {
        console.log(date)
        await deleteAccess(doctorId, date, selectedHours);
      }

      alert("Availability removed");
      setStep(1);
      setSelectedWeekdays([]);
      setSelectedHours([]);
      setStartDate("");
      setEndDate("");

    } catch (err) {
      console.error(err);
      alert("Failed to remove availability");
    }
  };


  return (
    <div style={{ padding: "1rem" }}>
      <h2>Doctor Availability</h2>

      {step === 1 && (
        <>
          <h3 className={styles.title}>Dodajemy czy usuwamy dostępność?</h3>
          <button>Dodawanie</button>
          <button>Usuwanie</button>

          <h3 className={styles.title}>Krok 1 - Wybierz przedział czasowy</h3>

          <label className={styles.title}>
            Start date:
            <input type="date" value={startDate}
              onChange={e => setStartDate(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>

          <br />

          <label className={styles.title}>
            End date:
            <input type="date" value={endDate}
              onChange={e => setEndDate(e.target.value)}
              style={{ marginLeft: 8 }}
            />
          </label>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className={styles.title}>Krok 2 - Które dni tygodnia?</h3>

          {weekdays.map(d => (
            <button key={d.value}
              onClick={() => toggle(d.value, setSelectedWeekdays)}
              style={{
                margin: 4,
                padding: "6px 12px",
                background: selectedWeekdays.includes(d.value) ? "#1890ff" : "#fff",
                color: selectedWeekdays.includes(d.value) ? "#fff" : "#000"
              }}>
              {d.label}
            </button>
          ))}
        </>
      )}

      {step === 3 && (
        <>
          <h3 className={styles.title}>Krok 3 - Jakie godziny?</h3>

          {hoursList.map(h => (
            <button key={h}
              onClick={() => toggle(h, setSelectedHours)}
              style={{
                margin: 4,
                padding: "6px 12px",
                background: selectedHours.includes(h) ? "#1890ff" : "#fff",
                color: selectedHours.includes(h) ? "#fff" : "#000"
              }}>
              {h}
            </button>
          ))}
        </>
      )}

      <div style={{ marginTop: 12 }}>
        {step > 1 && <button onClick={() => setStep(step - 1)}>Wróc</button>}
        {step < 3 && <button onClick={() => setStep(step + 1)}>Dalej</button>}
        {step === 3 && <button onClick={handleSave}>Zapisz</button>}
      </div>
    </div>
  );
}

export default DoctorAvailability;
