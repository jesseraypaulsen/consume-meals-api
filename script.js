
// https://www.themealdb.com/api.php
document.body.onload = consume;
const el = document.querySelector('#container');

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
  const menu = document.createElement('select');
  menu.addEventListener('click', fetchMealsByCategory);
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.innerText = cat;
    menu.appendChild(option);
  });
  el.appendChild(menu);
}

const grid = document.createElement('div');
grid.classList.add('grid');

function fetchMealsByCategory(e) {
  // clear container
  // el.innerHTML = ``;
  // clear meal grid
  removeAllChildNodes(grid);
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
        grid.appendChild(cell);
      })
      el.appendChild(grid);
    });
}

function displayMeal(id) {
  el.removeChild(grid);
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(res => {
      console.log(JSON.stringify(res));
      const meal = document.createElement('div');
      meal.classList.add('meal');
      meal.innerHTML = res.meals[0]["strInstructions"];
      console.log(res.meals[0]["strInstructions"]);
      el.appendChild(meal);
    })
}

//https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
