import { ref, get, push, update, remove, set } from "firebase/database";
import { database } from "./firebaseConfig.js";
import { Backend } from "../Backend.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
}
  from "firebase/auth";

export class FirebaseBackend extends Backend {
  constructor() {
    super();

    this.auth = getAuth(); // ✅ initialize Auth
    this.doctorsRef = ref(database, "doctors");
    this.patientRef = ref(database, "patients");
    this.absencesRef = ref(database, "absences");
  }

  async login(email, password) {
    if (!email || !password) throw new Error("Missing parameters");

    try {
      // 1️⃣ Sign in the user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;

      // 2️⃣ Check the Realtime Database to determine the role
      const patientSnap = await get(ref(database, `patients/${uid}`));
      if (patientSnap.exists()) {
        return { id: uid, role: "patient", ...patientSnap.val() };
      }

      const doctorSnap = await get(ref(database, `doctors/${uid}`));
      if (doctorSnap.exists()) {
        return { id: uid, role: "doctor", ...doctorSnap.val() };
      }

      console.error("User authenticated but not found in database");
      return null;

    } catch (err) {
      console.error("Login failed:", err);
      throw new Error("Invalid email or password");
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      return true;
    } catch (error) {
      console.error("Logout failed:", error);
      return false;
    }
  }


  async registerPatient(email, password, patientData) {
    try {
      const cred = await createUserWithEmailAndPassword(
        this.auth,  // must pass this.auth
        email,
        password
      );

      const uid = cred.user.uid;

      await set(ref(database, `patients/${uid}`), {
        email,
        role: "patient",
        createdAt: Date.now(),
        ...patientData
      });

      return {
        id: uid,
        email,
        role: "patient",
        ...patientData
      };
    } catch (error) {
      console.error("Patient registration failed:", error);
      throw error;
    }
  }

  async getDoctors() {
    const snapshot = await get(ref(database, "doctors"));
    if (!snapshot.exists()) return [];

    const doctors = snapshot.val();

    return Object.entries(doctors).map(([id, value]) => ({
      id,
      ...value
    }));
  }

  async getDoctorById(doctorId) {
    const snapshot = await get(ref(database, "doctors"));
    if (!snapshot.exists()) return [];

    const doctors = snapshot.val();

    const doctor = Object.entries(doctors)
      .filter(([id]) => id === doctorId)
      .map(([id, doctor]) => ({ id, ...doctor }))[0];

    return doctor
  }

  async getVisitsByPatient(patientId) {
    if (!patientId) return [];

    const visitsSnap = await get(ref(database, "visits"));
    if (!visitsSnap.exists()) return [];

    const doctorsSnap = await get(ref(database, "doctors"));
    const doctors = doctorsSnap.exists() ? doctorsSnap.val() : {};

    const visitsDict = visitsSnap.val();

    return Object.entries(visitsDict)
      .filter(([_, v]) => v.patient === patientId)
      .map(([id, v]) => {
        const doctor = doctors[v.doctor];

        return {
          id: id,
          type: "visit",
          patient: v.patient,
          doctorId: v.doctor,
          doctorName: doctor
            ? `${doctor.firstName} ${doctor.surname}`
            : "Unknown doctor",
          start: `${v.date}T${v.start}`,
          end: `${v.date}T${v.end}`,
        };
      });
  }

  async deleteVisit(visitId) {
    await remove(
      ref(database, `visits/${visitId}`)
    );
  }

  async addVisit(visit) {
    const { patient, doctor, date, start, end } = visit;

    if (!patient || !doctor || !date || !start || !end) {
      throw new Error("Invalid visit data");
    }

    const visitRef = push(ref(database, "visits"));

    await set(visitRef, {
      patient,
      doctor,
      date,
      start,
      end,
    });

    return visitRef.key;
  }

  async getAbsentDaysByDoctor(doctorId) {
    const snapshot = await get(ref(database, `doctors/${doctorId}/absences`));

    if (!snapshot.exists()) return [];

    const absencesDict = snapshot.val();

    return Object.keys(absencesDict).map((date) => ({
      id: date,
      date,
      type: "absence",
    }));
  }

  async addAbsentDay(doctorId, date) {
    if (!doctorId || !date) return;

    let isoDate;

    if (date instanceof Date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      isoDate = `${d}-${m}-${y}`;
    } else if (typeof date === "string") {
      if (date.split("-")[0].length === 2) {
        const [day, month, year] = date.split("-");
        isoDate = `${year}-${month}-${day}`;
      } else {
        isoDate = date;
      }
    } else {
      throw new Error("Invalid date format");
    }

    const dateRef = ref(database, `doctors/${doctorId}/absences/${isoDate}`);

    await set(dateRef, true);
  }

  async deleteAbsentDay(doctorId, date) {
    if (!doctorId || !date) return;

    let isoDate;

    if (date instanceof Date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      isoDate = `${d}-${m}-${y}`;
    } else if (typeof date === "string") {
      if (date.split("-")[0].length === 2) {
        const [day, month, year] = date.split("-");
        isoDate = `${year}-${month}-${day}`;
      } else {
        isoDate = date;
      }
    } else {
      throw new Error("Invalid date format");
    }

    const dateRef = ref(database, `doctors/${doctorId}/absences/${isoDate}`);

    await remove(dateRef);
  }

  async getAccessByDoctor(doctorId) {
    if (!doctorId) return [];

    const snapshot = await get(
      ref(database, `doctors/${doctorId}/access`)
    );

    if (!snapshot.exists()) return [];

    const accessByDate = snapshot.val();
    const events = [];

    Object.entries(accessByDate).forEach(([date, hoursObj]) => {
      if (typeof hoursObj !== "object") return;

      Object.entries(hoursObj).forEach(([hour, enabled]) => {
        if (!enabled) return;

        const [h, m] = hour.split(":").map(Number);

        if (Number.isNaN(h) || Number.isNaN(m)) return;

        const start = `${date}T${hour}:00`;

        let endHour = h;
        let endMinute = m + 30;

        if (endMinute >= 60) {
          endMinute = 0;
          endHour += 1;
        }

        const end = `${date}T${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}:00`;

        events.push({
          id: `${date}-${hour}`,
          type: "access",
          start,
          end
        });
      });
    });

    return events;
  }

  async addAccess(doctorId, date, hours) {
    if (!doctorId || !date || !Array.isArray(hours)) {
      throw new Error("Invalid parameters for addAccess");
    }

    if ((await this.getAbsentDaysByDoctor(doctorId)).find(a => a.date == date)) {
      alert("W tym dniu zaznaczyłeś absencję")
    }

    const updates = {};

    hours.forEach((hour) => {
      if (typeof hour !== "string") return;
      updates[`doctors/${doctorId}/access/${date}/${hour}`] = true;
    });

    await update(ref(database), updates);
  }

  async deleteAccess(doctorId, day, hour) {
    await remove(
      ref(database, `doctors/${doctorId}/periodicAccess/${day}/${hour}`)
    );
  }
}
