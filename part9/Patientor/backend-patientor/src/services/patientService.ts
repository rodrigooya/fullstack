import patients from "../../data/patients";
import { newPatient, NonSensitivePatient, Patient } from "../types";
import { v1 as uuid } from "uuid";
const id = uuid();
const getEntries = (): Patient[] => {
  return patients;
};
const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, ssn }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation,
    ssn,
  }));
};

const findById = (id: string): Patient | undefined => {
  const entry = patients.find((d) => d.id === id);
  return entry;
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
  findById,
};
