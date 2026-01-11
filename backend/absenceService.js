import { getBackend } from "./Services"; // helper to get backend instance safely

/**
 * Get all absences for a specific doctor
 * @param {string} doctorId
 */
export const getAbsentDaysByDoctor = (doctorId) => {
  return getBackend().getAbsentDaysByDoctor(doctorId);
};

/**
 * Get all absences (admin/system use)
 */
export const getAbsentDays = () => {
  return getBackend().getAbsentDays();
};

/**
 * Add a new absence
 * @param {object} absence { doctorId, date, reason? }
 */
export const addAbsentDay = (absence) => {
  return getBackend().addAbsentDay(absence);
};

/**
 * Delete an absence by its ID
 * @param {string} id
 */
export const deleteAbsentDay = (id) => {
  return getBackend().deleteAbsentDay(id);
};
