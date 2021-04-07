
// https://www.themealdb.com/api.php
document.body.onload = consume;
const el = document.querySelector('#main');

function consume() {
  getCategories();
  
  
  //this is originally where I was going to call createMenu() -- but that doesn't work.
  //due to asynchronous behavior, createMenu() must be called from within a promise chain.

}

function getCategories() {
  // list all categories
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`)
    .then(res => res.json())
    .then(res => {
      return processCategories(res.meals); // promise chain. the returned value here becomes the
    })                                     // argument for the next callback.
    .then(cats => createMenu(cats))
    .catch(err => {
      console.warn(err);
    });
}

function processCategories(catArray) {
  return catArray.map((cat, i) => {
    console.log(`${++i}. ${JSON.stringify(cat)}`);
    return cat['strCategory'];
  });
}

//create select menu where categories are the options
function createMenu(categories) {
  const menu = document.getElementById('catmenu');
  menu.addEventListener('click', fetchMealsByCategory);
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.innerText = cat;
    menu.appendChild(option);
  });
}

function fetchMealsByCategory(e) {
  removeAllChildNodes(el);
  el.classList.add('grid');

  if (el.classList.contains('meal')) {
    el.classList.remove('meal');
  }

  // filter by category
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.value}`)
    .then(res => res.json())
    .then(res => {
      res.meals.map(meal => {
        const { strMeal, strMealThumb, idMeal } = meal;
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', () => { displayMeal(idMeal) });
        cell.dataset.id = idMeal;
        cell.innerHTML = `<span style="font-size:16px;">${strMeal}</span> <img src="${strMealThumb}" style="width: 100px; height: 100px;">`;
        el.appendChild(cell);
      })
    });
}

function displayMeal(id) {

  removeAllChildNodes(el);

  el.classList.add('meal');

  if (el.classList.contains('grid')) {
    el.classList.remove('grid');
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(res => {
      console.log(JSON.stringify(res));
      el.innerHTML = res.meals[0]["strInstructions"];
    })
}

//https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
