const limit = 10;
const API_KEY = "7e51323f-835f-418b-923a-51345a73fe8e";
const API_KEY_SEARCH = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=`;
const API_URL_PREMIERES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=MAY`;

getPremieres(API_URL_PREMIERES);

async function getPremieres(url) {
  try {
    const response = await fetch(url, {
      headers: {
        "Content-type": "application/json",
        "X-API-KEY": API_KEY,
      },
    });
    const responseData = await response.json();
    displayMovies(responseData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

function getClassByRating(rating) {
  if (rating >= 7) {
    return "green";
  } else if (rating > 5) {
    return "orange";
  } else {
    return "red";
  }
}

function displayMovies(data) {
  const moviesEl = document.querySelector(".movies__grid-box");

  data.items.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <div class="movie__cover-inner">
    <img src="${movie.posterUrlPreview}"
        class="movie__cover" alt="${movie.nameRu}">
    <div class="movie__cover--overlay"></div>
    </div>
    <div class="movie__info">
        <div class="movie__title-box">
            <div class="movie__title">${movie.nameRu}</div>
            <a href="#">&#9829</a>
        </div>
        <div class="movie__category">${movie.genres.map(
          (genre) => ` ${genre.genre}`
        )}</div>
        <div class="movie__year">${movie.year}</div>
        <div class="movie__rating movie__rating--${getClassByRating(
          movie.rating
        )}">${movie.rating}</div>
    </div>
    `;
    moviesEl.appendChild(movieEl);
  });
}
