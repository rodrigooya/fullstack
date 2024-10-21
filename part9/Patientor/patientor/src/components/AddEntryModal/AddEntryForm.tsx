import { useState, SyntheticEvent, useEffect } from "react";

import {
  TextField,
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  FormControl,
  OutlinedInput,
  ListItemText,
  Checkbox,
} from "@mui/material";
import diagnosisService from "../../services/diagnosis";
import { Diagnosis, EntryFormValues, HealthCheckRating } from "../../types";

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
}

const AddEntryForm = ({ onCancel, onSubmit }: Props) => {
  const [types, setTypes] = useState("");
  const [description, setDescription] = useState("");
  const [specialist, setSpecialist] = useState("");
  const [diagnosisCodes, setDiagnosisCodes] = useState(
    Array<Diagnosis["code"]>
  );
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);

  const [date, setDate] = useState("");
  const [discharge, setDischarge] = useState({ date: "", criteria: "" });
  const [healthCheckRating, setHealthCheckRating] = useState(
    HealthCheckRating.Healthy
  );
  const [employerName, setEmployerName] = useState("");
  const [sickLeave, setSickLeave] = useState({ startDate: "", endDate: "" });

  useEffect(() => {
    const fetchDiagnosisList = async () => {
      const diagnoses = await diagnosisService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnosisList();
  }, []);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChange = (event: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = event;
    setDiagnosisCodes(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const EntryDetails: React.FC<{ type: EntryFormValues["type"] }> = ({
    type,
  }) => {
    if (type === "HealthCheck") {
      const onHealthChange = (event: SelectChangeEvent<number>) => {
        event.preventDefault();
        if (typeof event.target.value === "number") {
          const value = event.target.value;
          const healthCheckRating = value as HealthCheckRating;
          if (healthCheckRating) {
            setHealthCheckRating(healthCheckRating);
          }
        }
      };
      return (
        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="rating">Rating</InputLabel>
            <Select
              labelId="rating-label"
              id="rating"
              required
              label="HealthRatingCheck"
              value={healthCheckRating}
              onChange={onHealthChange}
            >
              <MenuItem value={0}>0</MenuItem>
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
            </Select>
          </FormControl>
        </div>
      );
    }
    if (type === "Hospital") {
      return (
        <div>
          <InputLabel style={{ marginTop: 20 }}>Discharge</InputLabel>
          <TextField
            label="Criteria"
            fullWidth
            value={discharge.criteria}
            onChange={({ target }) =>
              setDischarge({ ...discharge, criteria: target.value })
            }
          />
          <TextField
            id="date"
            type="date"
            label="Date"
            fullWidth
            value={discharge.date}
            onChange={({ target }) =>
              setDischarge({ ...discharge, date: target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
        </div>
      );
    }
    if (type === "OccupationalHealthcare") {
      return (
        <div>
          <InputLabel style={{ marginTop: 20 }}>Sickleave</InputLabel>
          <TextField
            id="date"
            type="date"
            label="StartDate"
            fullWidth
            value={sickLeave.startDate}
            onChange={({ target }) =>
              setSickLeave({ ...sickLeave, startDate: target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            id="date"
            type="date"
            label="EndDate"
            fullWidth
            value={sickLeave.endDate}
            onChange={({ target }) =>
              setSickLeave({ ...sickLeave, endDate: target.value })
            }
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            label="Employername"
            size="medium"
            value={employerName}
            onChange={({ target }) => setEmployerName(target.value)}
          />
        </div>
      );
    }
  };

  const onType = (event: SelectChangeEvent<string>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const types = value as EntryFormValues["type"];
      if (types) {
        setTypes(types);
      }
    }
  };

  const type: EntryFormValues["type"] = types as EntryFormValues["type"];

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();
    switch (type) {
      case "HealthCheck":
        onSubmit({
          description,
          date,
          specialist,
          diagnosisCodes,
          type,
          healthCheckRating,
        });
        break;
      case "Hospital":
        onSubmit({
          description,
          date,
          specialist,
          diagnosisCodes,
          type,
          discharge,
        });
        break;
      case "OccupationalHealthcare":
        onSubmit({
          description,
          date,
          specialist,
          diagnosisCodes,
          employerName,
          type,
          sickLeave,
        });
        break;
    }
  };
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="type-label">Type</InputLabel>
        <Select
          labelId="type-label"
          id="type"
          label="Type"
          value={types}
          onChange={onType}
        >
          <MenuItem value={"Hospital"}>Hospital</MenuItem>
          <MenuItem value={"HealthCheck"}>HealthCheck</MenuItem>
          <MenuItem value={"OccupationalHealthcare"}>
            OccupationalHealthcare
          </MenuItem>
        </Select>
      </FormControl>
      <Box
        component="form"
        sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
        noValidate
        autoComplete="off"
        onSubmit={addEntry}
      >
        <div>
          <TextField
            required
            id="outlined-textarea"
            label="Description"
            multiline
            value={description}
            onChange={({ target }) => setDescription(target.value)}
          />
          <TextField
            required
            id="outlined-required"
            label="Specialist"
            fullWidth
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />
          <TextField
            id="date"
            label="Date"
            type="date"
            fullWidth
            value={date}
            onChange={({ target }) => setDate(target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl sx={{ m: 1, width: "25ch" }}>
            <InputLabel id="code-label">Diagnosis Code</InputLabel>
            <Select
              labelId="code-checkbox-label"
              id="code-checkbox"
              multiple
              value={diagnosisCodes}
              onChange={handleChange}
              input={<OutlinedInput label="Diagnosis Code" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
            >
              {diagnoses.map((diagnose) => (
                <MenuItem key={diagnose.code} value={diagnose.code}>
                  <Checkbox checked={diagnosisCodes.includes(diagnose.code)} />
                  <ListItemText primary={diagnose.code} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {types && <EntryDetails type={type}></EntryDetails>}

          <Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                style={{ float: "left" }}
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  float: "right",
                }}
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </div>
      </Box>
    </div>
  );
};

export default AddEntryForm;
