
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
  // empty the container
  removeAllChildNodes(el);
  // change layout of container
  el.classList.add('meal');
  if (el.classList.contains('grid')) {
    el.classList.remove('grid');
  }

  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then(res => res.json())
    .then(res => {
      const meal = res.meals[0];
      el.innerHTML = parseMeal(meal);
    });
}

//https://www.florin-pop.com/blog/2019/09/random-meal-generator/
function parseMeal(meal) {
  const { strMeal, strCategory, strArea, strInstructions, strMealThumb, strTags, strSource } = meal;
  const ingredients = [];

  	// Get all ingredients from the object. Up to 20
	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(
				`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
			);
		} else {
			// Stop if there are no more ingredients
			break;
		}
	}

  return `
    <h1>${strMeal}</h1>
    <div style="display:flex;">
      <div>
        <img src=${strMealThumb} height='300px' width='300px'}>    
        <div>Category: ${strCategory}</div>
        <div>Region: ${strArea}</div>
        ${ strTags ? `<div>Tags: ${strTags}</div>` : '' }
      </div>
      <div>
        <ul>${ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>
    </div>
    <p style="width:650px">${strInstructions}</p>
    ${ strSource ? `<div>Source: ${strSource}</div>` : '' }
  `;
}

//https://www.javascripttutorial.net/dom/manipulating/remove-all-child-nodes/
function removeAllChildNodes(parent) {
  while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
  }
}
