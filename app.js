// DOM
const container = document.querySelector(".container");
// Movie container
const cardMovieContainer = document.querySelector(".card-modal-container");
// cardLoader
const cardLoaderWrapper = document.querySelector(".card-loader-wrapper");
const profile = document.querySelector(".profile");
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

// ------skelton loading------
let loaderHtml = `
<div class="card-loader card-loader--tabs"></div>
`;
for (let i = 0; i < 10; i++) {
  const div = document.createElement("div");
  div.innerHTML = loaderHtml;
  movieContainer.append(div);
}
// ------skelton loading end------

// Event Listeners

profile.addEventListener("click", () => {
  profile.classList.toggle("active");
});

window.addEventListener("load", loadCards);

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
      : sortValue === "likes"
      ? (sortValue = "like_count")
      : (sortValue = sortValue);

    callGetMovieFunc();
  });
});
// Functions
function createModal(
  year,
  cast,
  genres,
  rating,
  title,
  trailer,
  desc,
  img,
  bgImg
) {
  console.log(bgImg);
  const html = `
  <div class="card-modal-header">
  <div class="card-modal-title">
      ${title}
  </div>
  <div class="close">
      <div class="close">
          <i class="fas fa-times"></i>
      </div>
  </div>
</div>
<div class="card-modal-wrapper">
  <div class="left">
      <img src="${img}" alt="">
      <div class="year">${year}</div>
     
      <div class="imdb">
          IMDB: <span>${rating}</span>
      </div>
  </div>
  <div class="center">
      <div class="gener">
          <div class="btn">sci-fi</div>
          <div class="btn">comedy</div>
          <div class="btn">sci-fi</div>
          <div class="btn">comedy</div>
      </div>
      
      <div class="cast">
          <span class="cast-name">cast:</span>
          <div class="all-cast"><span class="btn">spider</span>
              <span class="btn">spider</span>
              <span class="btn">spideaaaaaaaaar</span>
              <span class="btn">spider</span>
          </div>
      </div>
      <div class="trailer">
          <span class="trailer-text">Trailer</span>
          <div class="trailer-box">
              <div class="background-img">
                  <div class="waves wave-1"></div>
                  <div class="waves wave-2"></div>
                  <div class="waves wave-3"></div>
                  <img src="${bgImg}"
                      alt="">

                  <a href="https://www.youtube.com/embed/${trailer}?rel=0&wmode=transparent&border=0&autoplay=1&iv_load_policy=3" class="video video-popup mfp-iframe"><i
                          class="fas fa-play"></i></a>
              </div>

          </div>
      </div>

  </div>
  <div class="right">
      <div class="description">
          <div class="title">Description:</div>
         ${desc}
      </div>
  </div>
</div>
  `;
  const div = document.createElement("div");
  div.classList.add("card-modal");
  div.innerHTML = html;
  cardMovieContainer.append(div);
  const closeModal = document.querySelector(".close");
  closeModal.addEventListener("click", () => {
    cardMovieContainer.classList.add("hidden");
    movieContainer.classList.remove("hidden");
  });
}

function triggerModals() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", function () {
      const id = this.children[0].children[0].innerText;
      cardMovieContainer.innerHTML = "";
      movieContainer.classList.add("hidden");
      cardMovieContainer.classList.remove("hidden");

      getMovieId(id);
    });
  });
}

function getMovieId(id) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    `https://yts.mx/api/v2/movie_details.json?movie_id=${id}&with_images=true&with_cast=true`
  );
  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);

        const allDesc = data.data.movie;
        console.log(allDesc);
        const {
          year,
          cast,
          genres,
          rating,
          title,
          yt_trailer_code: trailer,
          description_intro: desc,
          medium_cover_image: img,
          medium_screenshot_image1: bgImg,
        } = allDesc;
        createModal(
          year,
          cast,
          genres,
          rating,
          title,
          trailer,
          desc,
          img,
          bgImg
        );
      }
    }
  };
  xhr.send(null);
}

function triggerHoverEffect() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.children[0].children[4].classList.remove("hidden");
    });
    card.addEventListener("mouseleave", function () {
      this.children[0].children[4].classList.add("hidden");
    });
  });
}
function loadCards() {
  getAllMovies(sortValue);
}
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
            const {
              year,
              title,
              genres,
              medium_cover_image: image,
              rating,
            } = m;
            createCard(year, title, genres, image, rating);
          });
          triggerHoverEffect();
          triggerModals();
        }
      }
    }
  };
  xhr.send(null);
}
function callGetMovieFunc() {
  getAllMovies();
}
function createCard(year, title, genres, image, rating, id) {
  const html = `
  <div class="card-container">
  <div class="id hidden">${id}</div>
    <div class="card-img">
      <img src="${image}" alt="">
    </div>
    <div class="card-title">${title}</div>
    <div class="card-date">${year}</div>
    <div class="card-hover hidden">
      <div class="card-rating">${rating}/10</div>
      <div class="card-gener">
        <div>${genres[0]}</div>
        <div>${genres[1]}</div>
        <div>${genres[2]}</div>
      </div>
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
          const {
            year,
            title,
            genres,
            rating,
            medium_cover_image: image,
            id,
          } = m;
          createCard(year, title, genres, image, rating, id);
        });
        triggerHoverEffect();
        triggerModals();
      }
    }
  };
  xhr.send(null);
}
// trailer card : https://codepen.io/dtab428/pen/bRwMeq

// youtube trailer
// https://www.youtube.com/embed/iT16uxOEudU?rel=0&wmode=transparent&border=0&autoplay=1&iv_load_policy=3
// yts search https://yts.mx/api/v2/list_movies.json?query_term=${movie}

function getMoviesByGenre(genre) {
  const xhr = new XMLHttpRequest();
  xhr.open(
    "get",
    `https://yts.mx/api/v2/list_movies.json?genre={genre}&sort_by=year`
  );
  xhr.onload = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        lastPage.innerText = Math.floor(data.data.movie_count / 20);
        movieContainer.innerHTML = "";
        data.data.movies.forEach((m) => {
          const { year, title, genres, rating, medium_cover_image: image } = m;
          createCard(year, title, genres, image, rating);
        });
        triggerHoverEffect();
        triggerModals();
      }
    }
  };
  xhr.send(null);
}
