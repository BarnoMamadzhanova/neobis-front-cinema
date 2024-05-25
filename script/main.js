//*************consts & selectors */

const form = document.querySelector(".header__form");
const search = document.querySelector(".header__search");
const premiereBtn = document.querySelector("#premieres");
const comingSoonBtn = document.querySelector("#coming-soon");
const bestBtn = document.querySelector("#best");
const digitalBtn = document.querySelector("#digital");
const favoriteBtn = document.querySelector("#favorite");
const btnAddToFavorite = document.querySelector("#addFavorite");
const navDetails = document.querySelector(".nav__link > details");
const navDetailItems = document.querySelectorAll(".nav__link-item");
const modalEl = document.querySelector(".modal__window");

//******************API Urls* */
const limit = 12;
const API_KEY = "7e51323f-835f-418b-923a-51345a73fe8e";
const API_URL_POPULAR = `v2.2/films/collections?type=TOP_POPULAR_ALL&page=1`;
const API_URL_SEARCH = `v2.1/films/search-by-keyword?keyword=`;
const API_URL_PREMIERES = `v2.2/films/premieres?year=2024&month=MAY`;
const API_URL_BEST = `v2.2/films/collections?type=TOP_250_MOVIES&page=1`;
const API_URL_DIGITAL = `v2.1/films/releases?year=2024&month=MAY&page=1`;
const API_URL_COMING_SOON = `v2.2/films/collections?type=CLOSES_RELEASES&page=1`;
const API_URL_DETAILS = `https://kinopoiskapiunofficial.tech/api/v2.2/films/`;

let movies = [];

// Retrieve favorite movies from local storage
function getFavoriteMovies() {
  return JSON.parse(localStorage.getItem("favoriteMovies")) || [];
}

//****************fetching URL */
async function getMovies(url) {
  const BASE_URL = `https://kinopoiskapiunofficial.tech/api/`;

  try {
    const response = await fetch(BASE_URL.concat(url), {
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

//*********Getting rating name according to response */
function getRating(movie) {
  return movie.rating ?? movie.ratingKinopoisk ?? null;
}

//*********Getting movie name according to response */
function getMovieName(movie) {
  return movie.nameRu ?? movie.nameEn ?? movie.nameOriginal ?? null;
}

//*********Getting id according to response */
function getMovieId(movie) {
  return movie.kinopoiskId ?? movie.filmId ?? movie.imdbId;
}

//*************Calculating Class by rating */
function getClassByRating(rating) {
  if (rating >= 8) {
    return "green";
  } else if (8 > rating && rating >= 5) {
    return "orange";
  } else {
    return "red";
  }
}

//*******************Displayng movie cards */
function displayMovies(data) {
  const moviesEl = document.querySelector(".movies__grid-box");
  moviesEl.innerHTML = ""; // Clear previous movies

  if (data.films) {
    movies = data.films;
  } else if (data.releases) {
    movies = data.releases;
  } else if (data.items) {
    movies = data.items;
  } else if (Array.isArray(data)) {
    movies = data; // To handle the favoriteMovies array
  } else {
    console.error("Unexpected response format:", data);
    return;
  }

  const favoriteMovies = getFavoriteMovies();

  movies.slice(0, limit).forEach((movie) => {
    const rating = getRating(movie);
    const name = getMovieName(movie);
    const movieID = getMovieId(movie);

    const isFavorite = favoriteMovies.some(
      (favoriteMovie) => getMovieId(favoriteMovie) == movieID
    );

    const movieEl = document.createElement("div");

    let outputRating = "";
    if (rating && rating !== "null") {
      let classByRating = getClassByRating(rating);
      outputRating = `<div class="movie__rating movie__rating--${classByRating}">${rating}</div>`;
    }

    let outputYear = "";
    if (movie.year && movie.year >= 1000) {
      outputYear = `<div class="movie__year">${movie.year}</div>`;
    }

    movieEl.classList.add("movie");
    movieEl.innerHTML = `
    <div class="movie__cover-inner">
    <img src="${movie.posterUrlPreview}"
        class="movie__cover" alt="${name}">
    <div class="movie__cover--overlay"></div>
    </div>
    <div class="movie__info">
        <div class="movie__title-box">
            <div class="movie__title">${name}</div>
            <button class="addFavorite ${
              isFavorite ? "movie__favorite" : ""
            }" data-id="${movieID}">&#9829</button>
        </div>
        <div class="movie__category">${movie.genres.map(
          (genre) => ` ${genre.genre}`
        )}</div>
        ${outputYear}
        ${outputRating}
    </div>
    `;
    const movieDetailsImg = movieEl.querySelector(".movie__cover--overlay");
    const movieDetailsName = movieEl.querySelector(".movie__title");

    movieDetailsImg.addEventListener("click", () => openModalWindow(movieID));
    movieDetailsName.addEventListener("click", () => openModalWindow(movieID));

    moviesEl.appendChild(movieEl);
  });

  document.querySelectorAll(".addFavorite").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const selectedId = e.target.getAttribute("data-id");
      toggleFavorite(e.target, selectedId);
    });
  });
}

//****************************Favorites */
async function toggleFavorite(button, selectedId) {
  if (!localStorage.getItem("favoriteMovies")) {
    localStorage.setItem("favoriteMovies", "[]");
  }

  let favoriteMovies = JSON.parse(localStorage.getItem("favoriteMovies"));
  const movie = movies.find((movie) => getMovieId(movie) == selectedId);
  const isFavorite = favoriteMovies.some(
    (favoriteMovie) => getMovieId(favoriteMovie) == selectedId
  );

  if (isFavorite) {
    favoriteMovies = favoriteMovies.filter(
      (favoriteMovie) => getMovieId(favoriteMovie) != selectedId
    );
    button.classList.remove("movie__favorite");
  } else {
    favoriteMovies.push(movie);
    button.classList.add("movie__favorite");
  }

  localStorage.setItem("favoriteMovies", JSON.stringify(favoriteMovies));
}

//*******************Getting popular movies */
getMovies(API_URL_POPULAR);

//********************Getting movies by search */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
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

navDetailItems.forEach((item) => {
  item.addEventListener("click", function () {
    navDetails.removeAttribute("open");
  });
});

//********************Getting favorites */
favoriteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const favoriteMovies = getFavoriteMovies();
  displayMovies(favoriteMovies);
});

//***********************Modal Window*******/

async function openModalWindow(id) {
  const responseByID = await fetch(API_URL_DETAILS.concat(id), {
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": API_KEY,
    },
  });

  const responseByIdData = await responseByID.json();
  const name = getMovieName(responseByIdData);
  modalEl.classList.add("modal--display");
  document.body.classList.add("stop-scrolling");

  modalEl.innerHTML = `
    <div class="modal__card">
      <img class="modal__movie-backdrop" src="${
        responseByIdData.posterUrlPreview
      }" alt="${name}">
      <h2 class="modal__movie-title">${name}</h2>
      <ul class="modal__movie-info">
        <div class="loader"></div>
        <li class="modal__movie-genre">Жанр - ${responseByIdData.genres.map(
          (el) => ` <span>${el.genre}</span>`
        )}</li>
        ${
          responseByIdData.filmLength
            ? `<li class="modal__movie-runtime">Время - ${responseByIdData.filmLength} минут</li>`
            : ""
        }
        <li >Сайт: <a class="modal__movie-website" href="${
          responseByIdData.webUrl
        }">${responseByIdData.webUrl}</a></li>
        <li class="modal__movie-overview">Описание - ${
          responseByIdData.description
        }</li>
      </ul>
      <button type="button" class="modal__btn-close">Закрыть</button>
    </div>
  `;
  const btnClose = document.querySelector(".modal__btn-close");
  btnClose.addEventListener("click", () => closeModalWindow());
}

function closeModalWindow() {
  modalEl.classList.remove("modal--display");
  document.body.classList.remove("stop-scrolling");
}

window.addEventListener("click", (e) => {
  if (e.target === modalEl) {
    closeModalWindow();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.keyCode === 27) {
    closeModalWindow();
  }
});
