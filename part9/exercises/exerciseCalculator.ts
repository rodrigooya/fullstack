export const exerciseCalculator = (a: number[], b: number) => {
  const average =
    a.reduce((previus, current) => (current += previus)) / a.length;
  const success = b <= average;
  let ratingDescription = (success: boolean) => {
    if (success === true) {
      let ratingDescription = "good";
      return ratingDescription;
    }
    let ratingDescription = "bad";
    return ratingDescription;
  };
  let result = {
    periodLength: a.length,
    trainingDays: a.filter((element) => element != 0).length,
    target: b,
    average: average,
    success: success,
    ratingDescription: ratingDescription(success),
  };
  return result;
};
