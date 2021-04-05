
document.body.onload = consume;

function consume() {
  fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772`)
    .then(res => res.json())
    .then(res => {
      res = JSON.stringify(res);
      console.log(`the script has loaded! and here are the results: ${res}`);
    })
    .catch(err => {
      console.warn(err);
    });
}
