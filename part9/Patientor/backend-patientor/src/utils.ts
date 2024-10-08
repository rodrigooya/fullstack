import {
  Diagnose,
  EntryWithoutId,
  Gender,
  HealthCheckRating,
  newPatient,
} from "./types";

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseName = (name: unknown): string => {
  if (!isString(name)) {
    throw new Error("Incorrect or missing name");
  }

  return name;
};
const parseSsn = (ssn: unknown): string => {
  if (!isString(ssn)) {
    throw new Error("Incorrect or missing ssn");
  }

  return ssn;
};
const parseOccupation = (occupation: unknown): string => {
  if (!isString(occupation)) {
    throw new Error("Incorrect or missing occupation");
  }

  return occupation;
};
const parseDescription = (description: unknown): string => {
  if (!isString(description)) {
    throw new Error("Incorrect or missing description");
  }

  return description;
};
const parseSpecialist = (specialist: unknown): string => {
  if (!isString(specialist)) {
    throw new Error("Incorrect or missing specialist");
  }

  return specialist;
};
const parseEmployerName = (employerName: unknown): string => {
  if (!isString(employerName)) {
    throw new Error("Incorrect or missing employername");
  }

  return employerName;
};
const parseDischargeCriteria = (object: unknown): string => {
  if (!object || typeof object !== "object" || !("criteria" in object)) {
    throw new Error("que wea paso");
  }
  console.log(object.criteria);
  return object.criteria as string;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDateOfBirth = (dateOfBirth: unknown): string => {
  if (!isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error("Incorrect or missing date of birth: " + dateOfBirth);
  }
  return dateOfBirth;
};
const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date: " + date);
  }
  return date;
};

const parseEndDate = (object: unknown): string => {
  if (!object || typeof object !== "object" || !("sickLeave" in object)) {
    return "";
  }
  if (
    !object.sickLeave ||
    typeof object.sickLeave !== "object" ||
    !("endDate" in object.sickLeave)
  ) {
    throw new Error("que wea paso 5");
  }

  return object.sickLeave.endDate as string;
};
const parseStartDate = (object: unknown): string => {
  if (!object || typeof object !== "object" || !("sickLeave" in object)) {
    return "";
  }
  if (
    !object.sickLeave ||
    typeof object.sickLeave !== "object" ||
    !("startDate" in object.sickLeave)
  ) {
    throw new Error("que wea paso 3");
  }

  return object.sickLeave.startDate as string;
};
const parseDischargeDate = (object: unknown): string => {
  if (!object || typeof object !== "object" || !("date" in object)) {
    throw new Error("que wea paso");
  }
  console.log(object.date);
  return object.date as string;
};

const isGender = (param: string): param is Gender => {
  return Object.values(Gender)
    .map((v) => v.toString())
    .includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender: " + gender);
  }
  return gender;
};
const isNumber = (text: unknown): text is number => {
  return typeof text === "number" || text instanceof Number;
};
const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating)
    .map((v) => v.valueOf())
    .includes(param);
};

const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
    throw new Error(
      "Incorrect or missing healthcheckrating: " + healthCheckRating
    );
  }
  return healthCheckRating;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnose["code"]> => {
  if (!object || typeof object !== "object" || !("diagnosisCodes" in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnose["code"]>;
  }

  return object.diagnosisCodes as Array<Diagnose["code"]>;
};

const toNewPatient = (object: unknown): newPatient => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "name" in object &&
    "ssn" in object &&
    "dateOfBirth" in object &&
    "occupation" in object &&
    "gender" in object
  ) {
    const newEntry: newPatient = {
      gender: parseGender(object.gender),
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      occupation: parseOccupation(object.occupation),
      ssn: parseSsn(object.ssn),
      entries: [],
    };

    return newEntry;
  }

  throw new Error("Incorrect data: some fields are missing");
};
export const toNewEntry = (object: unknown): EntryWithoutId => {
  if (!object || typeof object !== "object") {
    throw new Error("Incorrect or missing data");
  }

  if (
    "description" in object &&
    "specialist" in object &&
    "date" in object &&
    "type" in object
  ) {
    switch (object.type) {
      case "HealthCheck":
        if ("healthCheckRating" in object) {
          const newHealthEntry: EntryWithoutId = {
            type: "HealthCheck",
            description: parseDescription(object.description),
            specialist: parseSpecialist(object.specialist),
            date: parseDate(object.date),
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
            diagnosisCodes: parseDiagnosisCodes(object),
          };
          return newHealthEntry;
        }
        throw new Error("Incorrect or missing data");
      case "Hospital":
        if ("discharge" in object) {
          const newHealthEntry: EntryWithoutId = {
            type: "Hospital",
            description: parseDescription(object.description),
            specialist: parseSpecialist(object.specialist),
            date: parseDate(object.date),
            diagnosisCodes: parseDiagnosisCodes(object),
            discharge: {
              criteria: parseDischargeCriteria(object.discharge),
              date: parseDischargeDate(object.discharge),
            },
          };
          return newHealthEntry;
        }
        throw new Error("Incorrect or missing data");
      case "OccupationalHealthcare":
        if ("employerName" in object) {
          const newHealthEntry: EntryWithoutId = {
            type: "OccupationalHealthcare",
            description: parseDescription(object.description),
            specialist: parseSpecialist(object.specialist),
            date: parseDate(object.date),
            diagnosisCodes: parseDiagnosisCodes(object),
            employerName: parseEmployerName(object.employerName),
            sickLeave: {
              startDate: parseStartDate(object),
              endDate: parseEndDate(object),
            },
          };
          return newHealthEntry;
        }
        throw new Error("Incorrect or missing data");
    }
  }
  throw new Error("Incorrect data: some fields are missing");
};
export default toNewPatient;
