import { useState } from "react";
import axios from "axios";
import patientService from "../../services/patients";
import AddEntryModal from "../AddEntryModal";
import {
  Diagnosis,
  Patient,
  Entry,
  HealthCheckRating,
  EntryFormValues,
} from "../../types";
import TransgenderIcon from "@mui/icons-material/Transgender";
import FemaleIcon from "@mui/icons-material/Female";
import MaleIcon from "@mui/icons-material/Male";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import WorkIcon from "@mui/icons-material/Work";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { yellow } from "@mui/material/colors";
import {
  Box,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { useMatch } from "react-router-dom";

interface Props {
  patients: Patient[];

  diagnoses: Diagnosis[];
}

interface Props2 {
  gender?: string | undefined;
  code?: string | undefined;
  healthCheckRating?: HealthCheckRating | undefined;
}

const Gender = ({ gender }: Props2) => {
  switch (gender) {
    case "female":
      return <FemaleIcon />;
    case "male":
      return <MaleIcon />;
    case "other":
      return <TransgenderIcon />;
    default:
      return;
  }
};

const Rating = ({ healthCheckRating }: Props2) => {
  if (healthCheckRating === 0) {
    return <FavoriteIcon color="success"></FavoriteIcon>;
  }
  if (healthCheckRating === 1) {
    return <FavoriteIcon sx={{ color: yellow[700] }}></FavoriteIcon>;
  }
  if (healthCheckRating === 2) {
    return <FavoriteIcon color="error"></FavoriteIcon>;
  }
  if (healthCheckRating === 3) {
    return <FavoriteIcon color="action"></FavoriteIcon>;
  }
};

const PatientPage = ({ patients, diagnoses }: Props) => {
  const match = useMatch({ path: "patients/:id", end: false });

  const patient = patients.find((patient) => patient.id === match?.params.id);

  const [entries, setEntries] = useState<Entry[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewPatient = async (values: EntryFormValues) => {
    try {
      const patient = patients.find(
        (patient) => patient.id === match?.params.id
      );
      if (patient) {
        const entry = await patientService.createEntry(patient, values);
        console.log(entry);

        setEntries(entries.concat(entry));
        setModalOpen(false);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };
  const Codes = ({ code }: Props2) => {
    const diagnosis = diagnoses?.find((diagnosis) => code === diagnosis.code);
    return (
      <List key={diagnosis?.code}>
        <ListItem sx={{ marginLeft: 2, p: 0, width: "95%" }}>
          <ListItemText primary={`${diagnosis?.code}`} />
          <ListItemText primary={`${diagnosis?.name}`} />
        </ListItem>
      </List>
    );
  };

  const BaseEntry: React.FC<{ entry: Entry }> = ({ entry }) => {
    return (
      <div className="App">
        <ListItem sx={{ mt: -2, fontStyle: "italic" }}>
          <ListItemText primary={`${entry.description}`} />
        </ListItem>
        {entry.diagnosisCodes?.map((codes) => (
          <Codes key={codes} code={codes}></Codes>
        ))}
      </div>
    );
  };
  const HealthCheckEntry: React.FC<{ entry: Entry }> = ({ entry }) => {
    return (
      <div className="App">
        <List sx={{ width: "90%", bgcolor: "background.paper" }} key={entry.id}>
          <ListItem
            sx={{ marginLeft: 2, width: "18ch" }}
            disableGutters
            secondaryAction={
              <ListItemIcon aria-label="medicalservice">
                <MedicalServicesIcon />
              </ListItemIcon>
            }
          >
            <ListItemText primary={`${entry.date}`} />
          </ListItem>
          <BaseEntry entry={entry}></BaseEntry>
          <ListItem sx={{ marginLeft: 1, width: "18ch" }}>
            <Rating healthCheckRating={entry.healthCheckRating}></Rating>
          </ListItem>

          <ListItem sx={{ mt: -3 }}>
            <ListItemText primary={`diagnose by ${entry.specialist}`} />
          </ListItem>
        </List>
      </div>
    );
  };
  const HospitalEntry: React.FC<{ entry: Entry }> = ({ entry }) => {
    return (
      <div className="App">
        <List
          sx={{
            width: "100%",
            bgcolor: "background.paper",
          }}
          key={entry.id}
        >
          <ListItem
            sx={{ marginLeft: 2, width: "18ch" }}
            disableGutters
            secondaryAction={
              <ListItemIcon aria-label="hospital">
                <LocalHospitalIcon />
              </ListItemIcon>
            }
          >
            <ListItemText primary={`${entry.date}`} />
          </ListItem>
          <BaseEntry entry={entry}></BaseEntry>
          <ListItem sx={{ mt: -3 }}>
            <ListItemText primary={`diagnose by ${entry.specialist}`} />
          </ListItem>
        </List>
      </div>
    );
  };

  const OccupationalHealthcareEntry: React.FC<{ entry: Entry }> = ({
    entry,
  }) => {
    return (
      <div className="App">
        <List
          sx={{
            width: "100%",

            bgcolor: "background.paper",
          }}
          key={entry.id}
        >
          <ListItem
            sx={{ marginLeft: 2, width: "36ch" }}
            disableGutters
            secondaryAction={<ListItemText primary={`${entry.employerName}`} />}
          >
            <ListItemText primary={`${entry.date}`} />

            <ListItemIcon
              sx={{ marginLeft: 2, width: "18ch" }}
              aria-label="work"
            >
              <WorkIcon />
            </ListItemIcon>
          </ListItem>
          <BaseEntry entry={entry}></BaseEntry>
          <ListItem sx={{ mt: -2 }}>
            <ListItemText primary={`diagnose by ${entry.specialist}`} />
          </ListItem>
        </List>
      </div>
    );
  };
  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case "HealthCheck":
        return <HealthCheckEntry entry={entry}></HealthCheckEntry>;
      case "Hospital":
        return <HospitalEntry entry={entry}></HospitalEntry>;
      case "OccupationalHealthcare":
        return (
          <OccupationalHealthcareEntry
            entry={entry}
          ></OccupationalHealthcareEntry>
        );

      default:
        return assertNever(entry);
    }
  };

  return (
    <div className="App">
      <br />
      <Box>
        <Typography align="left" variant="h4">
          {patient?.name}
          <Gender gender={patient?.gender}></Gender>
        </Typography>
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
          }}
        >
          <ListItem sx={{ m: 0 }}>
            <ListItemText primary={`ssn: ${patient?.ssn}`} />
          </ListItem>
          <ListItem sx={{ mt: -3 }}>
            <ListItemText primary={`occupation: ${patient?.occupation}`} />
          </ListItem>
        </List>
      </Box>
      <Box>
        <Typography align="left" variant="h6">
          entries
        </Typography>
        {patient?.entries.map((entry) => (
          <Box
            key={patient.id}
            sx={{
              bgcolor: "background.paper",
              borderColor: "text.primary",
              m: 1,
              border: 2,
              borderRadius: "5px",
            }}
          >
            <EntryDetails entry={entry}></EntryDetails>
          </Box>
        ))}
      </Box>
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewPatient}
        error={error}
        onClose={closeModal}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};
export default PatientPage;
// eslint-disable-next-line react-refresh/only-export-components
export function assertNever(x: never): never {
  throw new Error(`Unexpected object: ${x}`);
}
