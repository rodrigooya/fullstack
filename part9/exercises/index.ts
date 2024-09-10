import express from "express";
import { bmiCalculator } from "./bmiCalculator";
import { calculator, Operation } from "./calculator";
import { exerciseCalculator } from "./exerciseCalculator";

const app = express();
app.use(express.json());
app.get("/hello", (_req, res) => {
  res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const a = Number(req.query.height);
  const b = Number(req.query.weight);
  res.json(bmiCalculator(a, b));
});

app.post("/calculate", (req, res) => {
  const { value1, value2, op } = req.body;
  if (!value1 || isNaN(Number(value1))) {
    return res.status(400).send({ error: "..." });
  }
  const result = calculator(Number(value1), Number(value2), op as Operation);
  return res.send({ result });
});

app.post("/exercises", (req, res) => {
  const { daily_exercises, target } = req.body;

  const result = exerciseCalculator(daily_exercises, Number(target));
  return res.send({ result });
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
