// global_history = made out of synthetic data to imitate actual user base, intended to be randomised to pick uneven number of images form each category everyday.
let GH = []
// user history = made to keep a history of the user that is currently scrolling the page
let UH = []
// different base categories image source
let F = []
let H = []
let M = []
let N = []
let W = []

document.querySelector('.like-button').addEventListener('click', function() {
  document.querySelector('.card-container').classList.toggle('clicked');
});
