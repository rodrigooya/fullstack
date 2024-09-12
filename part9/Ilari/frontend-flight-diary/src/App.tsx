import { useState, useEffect } from "react";
import { Diary, ValidationError, Visibility, Weather } from "./types";
import { getAllDiary, createDiary } from "./services/diaryService";
import axios from "axios";

const Notification = (message: string | null) => {
  if (message === null) {
    return null;
  }
  return <div>{message}</div>;
};

const App = () => {
  const [diary, setDiary] = useState<Diary[]>([]);
  const [message, setMessage] = useState<string>("");
  const [date, setDate] = useState("");
  const [weather, setWeather] = useState<Weather>(Weather.Cloudy);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Good);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getAllDiary().then((data) => {
      setDiary(data);
    });
  }, []);

  const diaryCreation = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      createDiary({
        date: date,
        weather: weather,
        visibility: visibility,
        comment: comment,
      }).then((data) => {
        setDiary(diary.concat(data));
      });
      setDate("");
      setWeather(Weather.Cloudy);
      setVisibility(Visibility.Good);
      setComment("");
    } catch (error) {
      if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        console.log(error.status);
        console.error(error.response);
        setMessage(`${error.response}`);
        setTimeout(() => {
          setMessage("");
        }, 5000);
      } else {
        console.log(error);
      }
    }
  };
  return (
    <div>
      <Notification message={message} />
      <h2>Add new entry</h2>
      <form onSubmit={diaryCreation}>
        <div>
          <label>date:</label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setDate(event.target.value)
            }
          />
        </div>
        <div>
          <label>Visibiliy:</label> great{" "}
          <input
            type="radio"
            name="visibility"
            onChange={() => setVisibility(Visibility.Great)}
          />{" "}
          good{" "}
          <input
            type="radio"
            name="visibility"
            onChange={() => setVisibility(Visibility.Good)}
          />{" "}
          ok{" "}
          <input
            type="radio"
            name="visibility"
            onChange={() => setVisibility(Visibility.Ok)}
          />{" "}
          poor{" "}
          <input
            type="radio"
            name="visibility"
            onChange={() => setVisibility(Visibility.Poor)}
          />{" "}
        </div>
        <div>
          <label>Weather:</label> sunny{" "}
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Sunny)}
          />{" "}
          rainy{" "}
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Rainy)}
          />{" "}
          cloudy{" "}
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Cloudy)}
          />{" "}
          stormy{" "}
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Stormy)}
          />{" "}
          windy{" "}
          <input
            type="radio"
            name="weather"
            onChange={() => setWeather(Weather.Windy)}
          />{" "}
        </div>
        <div>
          <label>Comment:</label>
          <input
            type="text"
            data-testid="comment"
            value={comment}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setComment(event.target.value)
            }
          />
        </div>
        <button type="submit">add</button>
      </form>
      <h2>Diary Entries</h2>
      {diary.map((diary) => (
        <div key={diary.id}>
          <h4>{diary.date}</h4>
          <p>visibility: {diary.visibility}</p>
          <p>weather: {diary.weather}</p>
        </div>
      ))}
    </div>
  );
};
export default App;
