import { useState } from "react";
import { useQuery, useApolloClient, useSubscription } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";

import { ALL_AUTHORS, ALL_BOOKS, ME, BOOK_ADDED } from "./queries";

// eslint-disable-next-line react/prop-types
const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null;
  }
  return <div style={{ color: "red" }}>{errorMessage}</div>;
};

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set();
    return a.filter((item) => {
      let k = item.name;
      return seen.has(k) ? false : seen.add(k);
    });
  };
  console.log(query);
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    };
  });
};

const App = () => {
  const [genres, setGenres] = useState("");
  const [changePage, setChangePage] = useState("books");
  const resultuser = useQuery(ME);
  const resultAuthors = useQuery(ALL_AUTHORS);
  const resultBooks = useQuery(ALL_BOOKS, { variables: { genres } });
  const [errorMessage, setErrorMessage] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState("authors");
  const client = useApolloClient();
  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      notify(`${addedBook.title} added`);
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  if (resultBooks.loading) {
    return <div>loading...</div>;
  }
  if (resultAuthors.loading) {
    return <div>loading...</div>;
  }

  const notify = (message) => {
    setErrorMessage(message);
    setTimeout(() => {
      setErrorMessage(null);
    }, 10000);
  };
  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
  };

  const genre = genres;

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <div>
          <button
            onClick={() => {
              setPage("authors");
              setGenres("");
            }}
          >
            authors
          </button>
          <button onClick={() => setPage("books")}>books</button>
          <button
            onClick={() => {
              setPage("login");
              setGenres("");
            }}
          >
            login
          </button>
        </div>
        <Authors
          authors={resultAuthors.data.allAuthors}
          show={page === "authors"}
          token={token}
        />
        <Books
          books={resultBooks.data.allBooks}
          show={page === "books"}
          setGenres={setGenres}
          changePage={changePage}
          genre={genre}
        />
        <LoginForm
          setToken={setToken}
          setError={notify}
          show={page === "login"}
        />
      </div>
    );
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      <div>
        <button
          onClick={() => {
            setPage("authors");
            setGenres("");
          }}
        >
          authors
        </button>
        <button
          onClick={() => {
            setPage("books");
            setChangePage("books");
          }}
        >
          books
        </button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={logout}>logout</button>
        <button
          onClick={() => {
            setGenres(resultuser.data.me.favoriteGenre);
            setPage("books");
            setChangePage("recomendation");
          }}
        >
          recomendation
        </button>
      </div>

      <Authors
        authors={resultAuthors.data.allAuthors}
        show={page === "authors"}
        token={token}
      />

      <Books
        books={resultBooks.data.allBooks}
        setGenres={setGenres}
        show={page === "books"}
        changePage={changePage}
        genre={genre}
      />

      <NewBook show={page === "add"} setError={notify} />
    </div>
  );
};

export default App;
