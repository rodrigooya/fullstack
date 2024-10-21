import Genres from "./Genres";

const Books = (books) => {
  if (!books.show) {
    return null;
  }
  const book = books.books;

  const genres = books.books.map((a) =>
    a.genres.map((element) => {
      return element;
    })
  );
  const res = [...new Set(genres.flat())];

  return (
    <div>
      <Genres genre={books.genre} changePage={books.changePage} />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {book.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {res.map((b) => (
          <button
            key={b}
            onClick={() => {
              books.setGenres(b);
            }}
          >
            {b}
          </button>
        ))}
        <button
          onClick={() => {
            books.setGenres(null);
          }}
        >
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
