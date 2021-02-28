const apiUrl = "https://cat-fact.herokuapp.com/facts";
const refreshBtn = document.querySelector("#refreshBtn");
const searchFrom = document.querySelector("#get_cats");
const searchInput = document.querySelector(".search-form__input");
const errorLabel = document.querySelector(".search-form__label--error");
const sortBtnUp = document.querySelector("#sort__button-up");
const sortBtnDwon = document.querySelector("#sort__button-down");
const sortIdBtnUp = document.querySelector("#sort__id-up");
const sortIdBtnDown = document.querySelector("#sort__id-down");
const detailsContainer = document.querySelector("#detailsContainer");

const init = async () => {
  const resp = await fetch(`${apiUrl}/random?amount=30;
  const data = await resp.json();
  searchInput.value = "";
  searchInput.classList.remove("valid");
  showCats(data);
};

function checkIsNumberIsValid(numberOfCats) {
  if (numberOfCats < 1) {
    searchInput.classList.add("error");
    searchInput.classList.remove("valid");
    errorLabel.style.display = "block";
  } else {
    searchInput.classList.remove("error");
    searchInput.classList.add("valid");
    errorLabel.style.display = "none";
  }
}

function getCats(e) {
  e.preventDefault();
  const numberOfCats = document.querySelector('[name = "cats-number"]').value;
  checkIsNumberIsValid(numberOfCats);
  if (numberOfCats > 0) {
    fetch(`${apiUrl}/random?amount=${numberOfCats}`)
      .then((resp) => resp.json())
      .then((data) => showCats(data));
  }
}
function selectCatIcon() {
  return Math.floor(Math.random() * 2 + 1);
}
function trimString(text) {
  if (text.length > 55) {
    const introText = text.slice(0, 55) + "...";
    return introText;
  } else return text;
}
function trimId(id) {
  return id.slice(0, 12) + "...";
}
function getSingleCat(id) {
  fetch(`${apiUrl}/${id}`)
    .then((resp) => resp.json())
    .then((data) => showDescriptionPopup(data));
}
function getCatBoxes(catBoxes) {
  catBoxes.forEach((catBox) => {
    catBox.addEventListener("click", () => getSingleCat(catBox.dataset.id));
  });
}

function closeDescriptionPopup() {
  const popup = detailsContainer.children[0];
  detailsContainer.classList.remove("active");
  popup.classList.remove("active");
}

function showDescriptionPopup(data) {
  detailsContainer.textContent = "";
  const details = document.createElement("div");
  details.className = "details details-popup active";
  details.innerHTML = `<button class="details__button">
  <img src="./assets/exit-popup.svg" alt="exit" />
    </button>
    <div class="details__top">
      <div class="details__img">
        <img src="./assets/cat${selectCatIcon()}.svg" alt="cat" />
      </div>
      <div class="details__id">
        <p>ID: ${data._id}</p>
        <p>${data.createdAt}</p>
      </div>
    </div>
    <div class="details__bottom">
      <div class="details__descritpion">
        <p>
          ${data.text}
        </p>
      </div>
    </div>`;
  detailsContainer.appendChild(details);
  detailsContainer.classList.add("active");
  const closeDetailsBtn = document.querySelector(".details__button");
  closeDetailsBtn.addEventListener("click", closeDescriptionPopup);
}

function showCats(cats) {
  const appContent = document.querySelector(".app__content");
  appContent.textContent = "";
  if (cats.length > 1) {
    cats.map((cat) => {
      const catBox = document.createElement("div");
      catBox.className = "cat-box";
      catBox.dataset.id = `${cat._id}`;
      catBox.innerHTML = `
      <div class="cat-box__img">
        <img src="./assets/cat${selectCatIcon()}.svg" alt="cat" />
      </div>
      <div class="cat-box__description">
        <p class="cat-box__id">id: ${trimId(cat._id)}</p>
        <p class="cat-box__date">${cat.createdAt}</p>
        <p class="cat-box__text">${trimString(cat.text)}</p>
      </div>
      `;
      appContent.appendChild(catBox);
    });
  } else {
    const catBox = document.createElement("div");
    catBox.className = "cat-box";
    catBox.dataset.id = `${cats._id}`;
    catBox.innerHTML = `
      <div class="cat-box__img">
        <img src="./assets/cat${selectCatIcon()}.svg" alt="cat" />
      </div>
      <div class="cat-box__description">
        <p class="cat-box__id">id: ${trimId(cats._id)}</p>
        <p class="cat-box__date">${cats.createdAt}</p>
        <p class="cat-box__text">${trimString(cats.text)}</p>
      </div>
      `;
    appContent.appendChild(catBox);
  }
  const catBoxes = document.querySelectorAll(".cat-box");
  getCatBoxes(catBoxes);
  sortBy(cats);
}

//Comparer Function
function getSortOrderUp(prop) {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
}
function getSortOrderDown(prop) {
  return function (a, b) {
    if (a[prop] < b[prop]) {
      return 1;
    } else if (a[prop] > b[prop]) {
      return -1;
    }
    return 0;
  };
}
function sortByDateUp(array) {
  if (array.length > 1) {
    array.sort(getSortOrderUp("createdAt"));
    showCats(array);
  }
}
function sortByDateDown(array) {
  if (array.length > 1) {
    array.sort(getSortOrderDown("createdAt"));
    showCats(array);
  }
}
function sortByIdUp(array) {
  if (array.length > 1) {
    array.sort(getSortOrderUp("_id"));
    showCats(array);
  }
}
function sortByIdDown(array) {
  if (array.length > 1) {
    array.sort(getSortOrderDown("_id"));
    showCats(array);
  }
}

function sortBy(data) {
  sortBtnUp.addEventListener("click", () => sortByDateUp(data));
  sortBtnDwon.addEventListener("click", () => sortByDateDown(data));
  sortIdBtnUp.addEventListener("click", () => sortByIdUp(data));
  sortIdBtnDown.addEventListener("click", () => sortByIdDown(data));
}

searchFrom.addEventListener("submit", getCats);
refreshBtn.addEventListener("click", init);
document.addEventListener("DOMContentLoaded", init);
