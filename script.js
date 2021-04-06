
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
      return processCategories(res.meals);
      //fetchMealsByCategory();       //if something gets returned here, and we chain another promise,
    })                                //does the returned value become the arg for the next promise?
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

function fetchMealsByCategory(e) {
  // filter by category
  fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.value}`)
    .then(res => res.json())
    .then(res => {
      console.log(JSON.stringify(res));
    });
}
