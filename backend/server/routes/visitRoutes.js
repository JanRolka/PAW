import express from "express";
import Visit from "../models/Visit.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const visits = await Visit.find();
  res.json(visits);
});

router.get("/user/:userId", async (req, res) => {
  const visits = await Visit.find({
    $or: [{ patientId: req.params.userId }, { doctorId: req.params.userId }]
  });
  res.json(visits);
});

router.post("/", async (req, res) => {
  const visit = await Visit.create(req.body);
  res.status(201).json(visit);
});

export default router;
