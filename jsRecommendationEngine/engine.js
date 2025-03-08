// global_history = made out of synthetic data to imitate actual user base, intended to be randomised to pick uneven number of images form each category everyday.
let GH = {}
// user history = made to keep a history of the user that is currently scrolling the page
let UH = {}
// Final score based on combination of GH and UH
let FS = {}
// Next image value
let NI = null
// Adding a bias_counter which penalises a category if largely disliked
let DI = 0
// Logging time spent on a image for extra bias
let log_time_spent = Date.now()
// different base categories image source
let F = []
let H = []
let M = []
let N = []
let W = []

function load_images(category, array, count) {
    for (let i = 1; i <= count; i++) {
        array.push(`../static/engine_images/${category}/${category}_${i}.jpg`);
    }
    // console.log(`${category} images loaded:`, array);
    // returns None
}

function elapsed_time(){
  time = (Date.now()-log_time_spent)/1000
  return time
}

function global_history_updater(){

  const categories = ['F','H','M','N','W']
  // const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // This sets random global history everyday
  let category_dominator = null
  
  // We could have hardcoded dominant categories based on week-day as well.
  category_dominator = categories[Math.floor(Math.random()*categories.length)]

  categories_inferior = []
  
  // Now find categories which didn't dominate
  for(let i=0;i<categories.length;i++){
    if (categories[i] != category_dominator){
       categories_inferior.push(categories[i])
    }
  }
  // Now randomise the category inferior
  categories_inferior.sort(() => Math.random()-0.5)

  // Now return the scores
  GH[`${category_dominator}`] = 5
  GH[`${categories_inferior[0]}`] = 2
  GH[`${categories_inferior[1]}`] = 1.5
  GH[`${categories_inferior[2]}`] = 1
  GH[`${categories_inferior[3]}`] = 0.5
  
  console.log('GH now is:',GH)
}

function user_history_updater(UH=UH,update_by,category_to_update){
  if (UH.hasOwnProperty(`${category_to_update}`)) {
    // console.log("Key exists");
    UH[`${category_to_update}`] += update_by
  } else {
    // console.log("Key does not exist");
    UH[`${category_to_update}`] = update_by
  }
  console.log('UH now is:',UH)
}

function final_score_updater(GH={}, UH={}) {
  FS = { ...GH }; // Create a copy of GH
  for (let key of Object.keys(UH)) {  // Corrected key extraction
    if(GH.hasOwnProperty(key)){
      FS[key] = (GH[key]) + (UH[key]); // Handle undefined keys
    }
  }
  console.log('FS now is:',FS)
}

function dominant_category(GH=GH,UH=UH){
  let selectedSource = FS && Object.keys(FS).length > 0 ? FS : GH;
    
  if (Object.keys(selectedSource).length === 0) {
      console.log("FS and GH are empty! Cannot determine maxKey.");
      return; // Exit the function early
  }

  let maxKey = Object.keys(selectedSource).reduce((a, b) => (selectedSource[a] > selectedSource[b] ? a : b));

  console.log(`Key with max value: ${maxKey}, Value: ${selectedSource[maxKey]}`);
  return maxKey;
}

function next_image(GH={}, UH={}, FS={}) {
  
  maxKey = dominant_category(GH=GH,UH=UH)

    let imagePath = "";
    switch (maxKey[0]) {  // Check first letter of maxKey
        case 'F':
            imagePath = F[Math.floor(Math.random() * F.length)];
            break;
        case 'H':
            imagePath = H[Math.floor(Math.random() * H.length)];
            break;
        case 'M':
            imagePath = M[Math.floor(Math.random() * M.length)];
            break;
        case 'N':
            imagePath = N[Math.floor(Math.random() * N.length)];
            break;
        case 'W':
            imagePath = W[Math.floor(Math.random() * W.length)];
            break;
        default:
            imagePath = F.length > 0 ? F[0] : "https://via.placeholder.com/300"; // Fallback image
    }

    document.getElementById("cardImage").src = imagePath; // Update image
}

// Load respective image paths in respective arrays
load_images(category='food',array=F,count=20)
load_images(category='home',array=H,count=20)
load_images(category='men',array=M,count=20)
load_images(category='nature',array=N,count=20)
load_images(category='women',array=W,count=20)
// Update global history on load of page
global_history_updater()
// Update FS
final_score_updater(GH=GH,UH=UH)
// Show a image upon page load
next_image(GH,UH,FS)

function like_image(update_by=1,category_to_update=dominant_category(GH=GH,UH=UH)){
 user_history_updater(UH=UH,update_by=update_by,category_to_update=category_to_update)
 final_score_updater(GH=GH,UH=UH)
 next_image(GH=GH,UH=UH,FS=FS)
}

function dislike_image(update_by=-1,category_to_update=dominant_category(GH=GH,UH=UH)){
  user_history_updater(UH=UH,update_by=update_by,category_to_update=category_to_update)
  final_score_updater(GH=GH,UH=UH)
  next_image(GH=GH,UH=UH,FS=FS)
}

function skip_image(update_by=null){
  if(update_by = 0.5){
    like_image(update_by=0.5,category_to_update=dominant_category(GH=GH,UH=UH))
  }
  else{
    next_image(GH=GH,UH=UH,FS=FS)
  }
}

function bias_updater(param = null) {
  let time_spent = elapsed_time()
  maxKey = dominant_category(GH=GH,UH=UH)
  if (param === -1) {
      DI += 1;
      if (DI === 3) {
          dislike_image(-2, maxKey); // Pass correct arguments
      } else {
          dislike_image(-1, maxKey);
      }
  } else if(param === 1) {
      DI = 0
      like_image(1,maxKey)
  }
  else{
    DI = 0
    if(time_spent >= 5){
      skip_image(update_by = 0.5)
    }
    else{
      skip_image()
    }
  }
  log_time_spent = Date.now()
}
