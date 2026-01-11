export const translateSpecialization = (specialization) => {
  const map = {
    cardiologist: "Kardiolog",
    dermatologist: "Dermatolog",
    neurologist: "Neurolog",
    pediatrician: "Pediatra",
    internist: "Internista",
    orthopedist: "Ortopeda",
    psychiatrist: "Psychiatra",
    dentist: "Dentysta",
  };

  return map[specialization] || specialization || "—";
};
