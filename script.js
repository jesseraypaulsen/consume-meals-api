
// https://www.themealdb.com/api.php
document.body.onload = consume;

function consume() {
  const categories = [];
  // list all categories
  fetch(`https://www.themealdb.com/api/json/v1/1/list.php?c=list`)
    .then(res => res.json())
    .then(res => {
      //console.log(`the script has loaded! and here are the results: ${JSON.stringify(res)}`);
      res.meals.forEach((cat, i) => {
        categories.push(cat);
        console.log(`${++i}. ${JSON.stringify(cat)}`);
      });
    })
    .catch(err => {
      console.warn(err);
    });
}

// basic structure of the app:
// list all categories
// loop cats, show meals in each cat
// display meals in flexbox container
// give each meal the same event listener
// expand a meal to see its detail in its own isolated space

// a select menu for cats
// one of the options selected by default, with meals in this cat showing onload
