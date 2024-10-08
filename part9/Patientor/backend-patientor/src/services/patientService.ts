import patients from "../../data/patients-full";
import {
  newPatient,
  NonSensitivePatient,
  Patient,
  Entry,
  EntryWithoutId,
} from "../types";
import { v1 as uuid } from "uuid";
const id = uuid();
const getEntries = (): Patient[] => {
  return patients;
};
const getNonSensitiveEntries = (): NonSensitivePatient[] => {
  return patients.map(
    ({ id, name, dateOfBirth, gender, occupation, ssn, entries }) => ({
      id,
      name,
      dateOfBirth,
      gender,
      occupation,
      ssn,
      entries,
    })
  );
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

const addEntry = (
  entries: EntryWithoutId,
  patient: Patient | undefined
): Entry => {
  const newEntry = {
    id,
    ...entries,
  };

  patient?.entries.push(newEntry);
  return newEntry;
};

export default {
  getEntries,
  addPatient,
  addEntry,
  getNonSensitiveEntries,
  findById,
};
