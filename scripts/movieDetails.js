// global var
let movie;
let idMovie;

// Access to dom
let notFoundMovie = document.getElementById("not-found-movie");
let movie_details = document.getElementById("movie-details");

// get id movie from url
function getId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  idMovie = id;
}

// fetch data from api
const getMovie = () => {
  getId();
  fetch(
    `https://api.themoviedb.org/3/movie/${idMovie}?api_key=8faa43184fcf977afb95b5c409d87b9f`
  )
    .then(res => res.json())
    .then(data => {
      movie = data;
      movie_details.innerHTML = detailsTemplate(data);
      document.getElementById(
        "img"
      ).style.background = `url(https://image.tmdb.org/t/p/w500${data.backdrop_path}) center top / cover  no-repeat`;
    })
    .catch(error => {
      notFoundMovie.innerHTML = "Not found";
      notFoundMovie.style.display = "block";
      console.log(error);
    });
};

// Template - Movie Page
const detailsTemplate = details => {
  let template = `
  <div class="container-movie">
  <div class="header-movie">
    <div id="img" class="d-movie-image">
    </div>
    <div class="movie-details">
      <div class="movie-title">
        <h1 class="d-movie-name">${details.title}</h1>
        <h3 class="vote-avarage"><i class="far fa-star"></i>${details.vote_average}</h3>
      </div>
      <div class="geners details">
        <ul>`;
  details.genres.forEach(element => {
    template += `<li>${element.name}</li>`;
  });
  template += `   
        </ul>
      </div>
      <div class="releas_date details">
        <h3>Release:</h3>
        <span>${details.release_date}</span>
      </div>
      <div class="run_time details">
        <h3>Run Time:</h3>`;
  var hours = Math.floor(details.runtime / 60);
  var minutes = details.runtime % 60;
  template += `<span>${hours}hr ${minutes}min</span>`;
  template += `
      </div>
      <div  class="add-favorites">
      `;
  let favorites = JSON.parse(localStorage.getItem("my_favorites"));
  const found = favorites
    ? favorites.find(movie => movie.id == idMovie)
    : undefined;
  if (found == undefined) {
    template += `<button id="add-to-favorites" onclick="addToFavorites(${details.id})"  class="btn btn-add">Mark a movie</button>`;
  } else {
    template += `<button id="remove-movie" onclick="removeFromFavorites(${details.id})"  class="btn btn-remove">Remove a movie</button>`;
  }
  template += `
      </div>
    </div>
  </div>
  <div class="body-details">
      <h2>OVERVIEW</h2>
    <div class="overview">
      ${details.overview}
    </div>`;

  return template;
};

// Add a favorite movie to localstorage -my_favorites
function addToFavorites(id) {
  if (localStorage.getItem("my_favorites") === null) {
    localStorage.setItem("my_favorites", JSON.stringify([movie]));
  } else {
    oldItems = JSON.parse(localStorage.getItem("my_favorites"));

    oldItems.push(movie);

    localStorage.setItem("my_favorites", JSON.stringify(oldItems));
  }
  let buttonFavorites = document.getElementById("add-to-favorites");
  buttonFavorites.innerHTML = "Remove a movie";
  buttonFavorites.classList.remove("btn-add");
  buttonFavorites.classList.add("btn-remove");
  buttonFavorites.setAttribute("onclick", `removeFromFavorites(${id})`);
}
// // remove a  movie from localstorage -my_favorites
function removeFromFavorites(id) {
  let buttonFavorites = document.getElementsByClassName("btn-remove")[0];
  let favorites = JSON.parse(localStorage.getItem("my_favorites"));
  let newFavorites = favorites.filter(movie => movie.id !== id);
  localStorage.setItem("my_favorites", JSON.stringify(newFavorites));
  buttonFavorites.innerHTML = "Mark a movie";
  buttonFavorites.classList.remove("btn-remove");
  buttonFavorites.classList.add("btn-add");
  buttonFavorites.setAttribute("onclick", `addToFavorites(${id})`);
}

// Go to previous page
const goBack = () => {
  window.history.back();
};
