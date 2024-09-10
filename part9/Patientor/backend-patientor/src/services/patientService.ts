import patients from "../../data/patients";
import { newPatient, NonSensitivePatient, Patient } from "../types";
import { v1 as uuid } from "uuid";
const id = uuid();
const getEntries = (): Patient[] => {
  return patients;
};
const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
  }));
};
const addPatient = (entry: newPatient): Patient => {
  const newPatient = {
    id,
    ...entry,
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getEntries,
  addPatient,
  getNonSensitiveEntries,
};
