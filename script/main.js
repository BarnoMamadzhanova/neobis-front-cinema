const API_KEY = "7e51323f-835f-418b-923a-51345a73fe8e";
const API_URL_PREMIERES =
  "https://kinopoiskapiunofficial.tech/api/v2.2/films/premieres?year=2024&month=MAY";

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

function displayMovies(data) {
  const moviesEl = document.querySelector(".movies__grid-box");

  data.items.forEach((movie) => {
    const movieEl = document.createElement("div");
  });
}
