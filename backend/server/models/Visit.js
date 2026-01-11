import mongoose from "mongoose";

const visitSchema = new mongoose.Schema({
  date: String,
  patientId: String,
  doctorId: String,
  description: String
});

export default mongoose.model("Visit", visitSchema);
