
// https://www.themealdb.com/api.php
document.body.onload = consume;

const categories = [];

function consume() {
  // list all categories
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`)
    .then(res => res.json())
    .then(res => {
      processCategories(res.meals);
      fetchMealsByCategory();
    })
    .catch(err => {
      console.warn(err);
    });

  
}

function processCategories(catArray) {
  catArray.forEach((cat, i) => {
    categories.push(cat);
    console.log(`${++i}. ${JSON.stringify(cat)}`);
  });
}

function fetchMealsByCategory() {
  categories.forEach(cat => {
    // filter by category
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${cat['strCategory']}`)
      .then(res => res.json())
      .then(res => {
        console.log(`${cat['strCategory']} -> ${JSON.stringify(res)}`);
      });
  })
}

function abc(data) {
  document.getElementById('container');
  container.innerHTML = `
			<span>${data.value}</span>
			<small></small>
			<div class="percent-bar"></div>
		`;
}
// basic structure of the app:
// list all categories
// loop cats, show meals in each cat
// display meals in flexbox container
// give each meal the same event listener
// expand a meal to see its detail in its own isolated space

// a select menu for cats
// one of the options selected by default, with meals in this cat showing onload
