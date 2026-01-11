import { FirebaseBackend } from "./firebase/FireBaseBackend";
import { ServerBackend } from "./server/ServerBackend";

let backendInstance;

export const initBackend = (type) => {
  if (!backendInstance) {
    if (type === "firebase") backendInstance = new FirebaseBackend();
    else if (type === "server") backendInstance = new ServerBackend();
    else throw new Error("Unknown backend type");
  }
};

export const getBackend = () => {
  if (!backendInstance) {
    const type = localStorage.getItem("backend") || "firebase";
    initBackend(type);
  }
  return backendInstance;
};

export const registerPatient = (email, password, patientData) => getBackend().registerPatient(email, password, patientData);
export const login = (email, password) => getBackend().login(email, password)

/* ---------------- USERS ---------------- */
export const getUsers = () => getBackend().getUsers();
export const getUserById = (id) => getBackend().getUserById(id);
export const addUser = (user) => getBackend().addUser(user);
export const updateUser = (id, data) => getBackend().updateUser(id, data);
export const deleteUser = (id) => getBackend().deleteUser(id);
export const getDoctors = (id) => getBackend().getDoctors();

/* ---------------- AUTH ---------------- */
export const loginUser = (login, password, role) => getBackend().login(login, password, role);
export const logoutUser = () => getBackend().logout();
export const getCurrentUser = () => getBackend().getCurrentUser();

/* ---------------- VISITS ---------------- */
export const getVisitsByPatient = (userId) => getBackend().getVisitsByPatient(userId);
export const addVisit = (visit) => getBackend().addVisit(visit);
export const deleteVisit = (visitId) => getBackend().deleteVisit(visitId);

/* ---------------- ABSENCES ---------------- */
export const getAbsentDaysByDoctor = (doctorId) => getBackend().getAbsentDaysByDoctor(doctorId);
export const addAbsentDay = (doctorId, data) => getBackend().addAbsentDay(doctorId, data);
export const deleteAbsentDay = (doctorId, data) => getBackend().deleteAbsentDay(doctorId, data);

/* ---------------- Access ------------- */
export const getAccessByDoctor = (doctorId) => getBackend().getAccessByDoctor(doctorId);
export const addAccess = (doctorId, day, hours) => getBackend().addAccess(doctorId, day, hours);
export const deleteAccess = (doctorId, day, hour = null) => getBackend().deleteAccess(doctorId, day, hour);
