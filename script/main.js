//*************consts */
const limit = 10;
const form = document.querySelector(".header__form");
const search = document.querySelector(".header__search");
const premiereBtn = document.querySelector("#premieres");
const comingSoonBtn = document.querySelector("#coming-soon");
const bestBtn = document.querySelector("#best");
const digitalBtn = document.querySelector("#digital");
const favoriteBtn = document.querySelector("favorite");
const API_KEY = "7e51323f-835f-418b-923a-51345a73fe8e";
const API_KEY_SEARCH = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=`;
const API_URL_PREMIERES = `https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=MAY`;

//****************fetching URL */
async function getMovies(url) {
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

//*******************Displayng movie cards */
function displayMovies(data) {
  const moviesEl = document.querySelector(".movies__grid-box");
  document.querySelector(".movies__grid-box").innerHTML = "";

  let movies = [];
  if (data.films) {
    movies = data.films;
  } else if (data.releases) {
    movies = data.releases;
  } else if (data.items) {
    movies = data.items;
  } else {
    console.error("Unexpected response format:", data);
    return;
  }

  movies.forEach((movie) => {
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
        ${
          movie.rating
            ? `<div class="movie__rating movie__rating--${getClassByRating(
                movie.rating
              )}">${movie.rating}</div>`
            : "" // Empty string if rating doesn't exist
        }

    </div>
    `;
    moviesEl.appendChild(movieEl);
  });
}

//*************Calculating Class by rating */
function getClassByRating(rating) {
  if (rating >= 7) {
    return "green";
  } else if (rating > 5) {
    return "orange";
  } else {
    return "red";
  }
}

//********************Getting movies by search */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_KEY_SEARCH}${search.value}`;
  if (search.value) {
    getMovies(apiSearchUrl);
    search.value = "";
  }
});

//********************Getting premieres */
premiereBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getMovies(API_URL_PREMIERES);
});

//********************Getting coming soon */
comingSoonBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getMovies(API_URL_COMING_SOON);
});

//********************Getting top movies */
bestBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getMovies(API_URL_BEST);
});

//********************Getting digital releases */
digitalBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getMovies(API_URL_DIGITAL);
});

//********************Getting favorites */
// favoriteBtn.addEventListener("click", (e) => {
//   e.preventDefault();
//   getMovies(API_URL_FAVORITE);
// });
