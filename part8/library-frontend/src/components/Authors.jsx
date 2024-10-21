import Select from "react-select";
import { EDIT_AUTHOR } from "../queries";
import { useMutation } from "@apollo/client";
import { useState } from "react";

const Authors = (authors) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const [changeBorn] = useMutation(EDIT_AUTHOR);

  if (!authors.show) {
    return null;
  }

  const submit = (event) => {
    event.preventDefault();
    console.log(name, born);
    changeBorn({ variables: { name, born } });

    setName("");
    setBorn("");
  };

  if (!authors.token) {
    return (
      <div>
        <h2>authors</h2>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>born</th>
              <th>books</th>
            </tr>
            {authors.authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="App">
        <h2>Set Birthyear</h2>
        <form onSubmit={submit}>
          <Select
            options={authors.authors}
            getOptionLabel={(option) => option.name}
            getOptionValue={(option) => option.name}
            onChange={({ name }) => setName(name)}
          />
          <div>
            born
            <input
              type="number"
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type="submit">update author</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
