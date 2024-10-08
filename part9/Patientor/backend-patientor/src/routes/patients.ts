import express from "express";
import patientService from "../services/patientService";
import toNewPatient, { toNewEntry } from "../utils";

const router = express.Router();

router.get("/", (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get("/:id", (req, res) => {
  const entry = patientService.findById(String(req.params.id));

  if (entry) {
    res.send(entry);
  } else {
    res.sendStatus(404);
  }
});
router.post("/", (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const addedPatient = patientService.addPatient(newPatient);
    res.json(addedPatient);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

router.post("/:id/entries", (req, res) => {
  try {
    const patient = patientService.findById(String(req.params.id));
    console.log(patient);
    const newEntry = toNewEntry(req.body);
    console.log(newEntry);

    const addedEntry = patientService.addEntry(newEntry, patient);
    console.log(addedEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    let errorMessage = "Something went wrong.";
    if (error instanceof Error) {
      errorMessage += " Error: " + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;
