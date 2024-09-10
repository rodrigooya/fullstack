export interface MultiplyValues {
  value1: number;
  value2: number;
}

export const parseArgument = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error("Not enough arguments");
  if (args.length > 4) throw new Error("Too many arguments");

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3]),
    };
  } else {
    throw new Error("Provided values were not numbers!");
  }
};

export const bmiCalculator = (a: number, b: number) => {
  const imc = b / ((a * a) / 10000);

  if (imc <= 18.5) {
    let result = { weight: a, height: b, bmi: "Bajo:" };
    return result;
  }
  if (imc > 18.5 && imc < 24.9) {
    let result = { weight: a, height: b, bmi: "Normal (healthy weight):" };
    return result;
  }
  if (imc >= 24.9) {
    let result = { weight: a, height: b, bmi: "Overweight:" };
    return result;
  }

  return "error: ";
};

try {
  const { value1, value2 } = parseArgument(process.argv);
  bmiCalculator(value1, value2);
} catch (error: unknown) {
  let errorMessage = "Something bad happened.";
  if (error instanceof Error) {
    errorMessage += " Error: " + error.message;
  }
  console.log(errorMessage);
}
