// DOM
const navs = document.querySelectorAll(".nav");
const movieContainer = document.querySelector(".movie-container");
// pagination
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");
const pageNumber = document.querySelector(".page");
const lastPage = document.querySelector(".last-page");

let currentPage = 1;
// default value of sort
let sortValue = "download_count";
// search input
const searchBox = document.querySelector(".search-movie-input");

// Event Listeners
searchBox.addEventListener("input", () => {
  const val = searchBox.value;
  searchMovie(val);
});
rightBtn.addEventListener("click", () => {
  currentPage++;
  pageNumber.innerText = currentPage;
  callGetMovieFunc();
});
leftBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    callGetMovieFunc();
  }

  pageNumber.innerText = currentPage;
});

navs.forEach((nav) => {
  nav.addEventListener("click", (e) => {
    navs.forEach((nav) => {
      nav.classList.remove("active");
    });
    e.target.classList.add("active");

    currentPage = 1;
    pageNumber.innerText = currentPage;
    sortValue = e.target.innerText.toLowerCase();
    sortValue === "popular"
      ? (sortValue = "download_count")
      : sortValue === "recent"
      ? (sortValue = "year")
      : (sortValue = sortValue);
    callGetMovieFunc();
  });
});
getAllMovies(sortValue);
// Functions

function searchMovie(value) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    `https://yts.mx/api/v2/list_movies.json?query_term='${value}'&page=${currentPage}`
  );
  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        lastPage.innerText = Math.ceil(data.data.movie_count / 20);
        movieContainer.innerHTML = "";
        if (data.data.movie_count > 0) {
          data.data.movies.forEach((m) => {
            const { year, title, genres, medium_cover_image: image } = m;
            createCard(year, title, genres, image);
          });
        }
      }
    }
  };
  xhr.send(null);
}
function callGetMovieFunc() {
  getAllMovies();
}
function createCard(year, title, genres, image) {
  const html = `
  <div class="card-img">
    <img src="${image}" alt="">
  </div>
  <div class="card-title">${title}</div>
  <div class="card-date">${year}</div>
  <div class="card-hover hidden">
    <div class="card-rating">6.1/10</div>
    <div class="card-gener">
      <div>Comedy</div>
      <div>History</div>
    </div>
  </div>
  `;
  const div = document.createElement("div");
  div.classList.add("card");
  div.classList.add("neumorphic");
  div.innerHTML = html;
  movieContainer.append(div);
}
// get movies Api call
function getAllMovies() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    `https://yts.mx/api/v2/list_movies.json?sort_by=${sortValue}&page=${currentPage}`
  );
  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        lastPage.innerText = Math.floor(data.data.movie_count / 20);
        movieContainer.innerHTML = "";
        data.data.movies.forEach((m) => {
          const { year, title, genres, medium_cover_image: image } = m;
          createCard(year, title, genres, image);
        });
      }
    }
  };
  xhr.send(null);
}

// youtube trailer
// https://www.youtube.com/embed/iT16uxOEudU?rel=0&wmode=transparent&border=0&autoplay=1&iv_load_policy=3
// yts search https://yts.mx/api/v2/list_movies.json?query_term=${movie}
