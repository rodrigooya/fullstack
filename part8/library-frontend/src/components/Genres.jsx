const Genres = (genre) => {
  if (!genre.genre) {
    return <h2>{genre.changePage}</h2>;
  }
  if (genre.changePage === "recomendation") {
    return (
      <div>
        <h2>{genre.changePage}</h2>
        <h3> books in your favorite genre {genre.genre}</h3>
      </div>
    );
  }
  return (
    <div>
      <h2>{genre.changePage}</h2>
      <h3> in genre {genre.genre}</h3>
    </div>
  );
};
export default Genres;
