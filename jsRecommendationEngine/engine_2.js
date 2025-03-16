// This will be the engine 2 somewhat smarter Markov chain principle.
let MP = {0:'I',1:'W',2:'A',3:'L'}
let UH = []

// Now the matrices which will be used to generate next image
let TM = []
let CS = [0,0,0,0]

// returns None
function TM_generator(){
 for(let i=0;i<4;i++){
    TM.push([])
    for(let j=0;j<4;j++){
        TM[i].push(0.25)
    }   
 }

 for(let i=0;i<TM.length;i++){
    let x = Math.floor(Math.random()*2)+1
    TM[i][x] += 0.25 
    TM[i][x-1] -= 0.125
    TM[i][x+1] -= 0.125
 }
}

function TM_updater(UB, f, t) {
    if (TM.length === 1) return null;

    let weight = (UB === 1) ? 0.15 : (UB === 0.5) ? 0.09 : -0.15;
    if (weight == -0.15 && UB == -2){
        weight = -0.6
    }
    let N = TM[f].length;
    
    if (f !== t) {
        // Apply weighted probability update
        TM[f][t] = TM[f][t] + weight * (1 - TM[f][t]);
        
        let totalReduction = weight * TM[f][t] / (N - 1);
        for (let i = 0; i < N; i++) {
            if (i !== t) {
                TM[f][i] = TM[f][i] * (1 - weight);
            }
        }
    } else {
        // Self-transition update
        TM[f][f] = TM[f][f] + weight * (1 - TM[f][f]);
        
        let totalReduction = weight * TM[f][f] / (N - 1);
        for (let i = 0; i < N; i++) {
            if (i !== f) {
                TM[f][i] = TM[f][i] * (1 - weight);
            }
        }
    }
    
    // Normalize row to ensure sum = 1
    let rowSum = TM[f].reduce((sum, val) => sum + val, 0);
    for (let i = 0; i < N; i++) {
        TM[f][i] /= rowSum;
    }
}


// returns None
function CS_updater(param=null){
 CS = [0,0,0,0]
 CS[param] = 1
}

// returns picked category
function image_generator(SC=false){
    if (UH.length == 0) {
    //  then change the CS to turn any category into 1 and multiply with TM to pick the next image
    let c = Math.floor(Math.random()*4)
    CS[c] = 1
    console.log(`Going from ${MP[c]}`)
    // Step to multiply with TM
    let picked_category = -Infinity
    let second_picked_category = -Infinity
    let last_value = -Infinity
    let second_last_value = -Infinity
    for(let i=0;i<TM[c].length;i++){
        if((TM[c][i]) > last_value){
            last_value = TM[c][i]
            picked_category = i
        }
    }
    for(let j=0;j<TM[c].length;j++){
        if((TM[c][j]) > second_last_value && TM[c][j]<last_value){
            second_last_value = TM[c][j]
            second_picked_category = j
        }
    }
    console.log(`Going to ${MP[(SC ? second_picked_category:picked_category)]}`)
    return {c,'picked_category':(SC ? second_picked_category:picked_category)}
    }
    else{
    // We have UH then directly multiply with TM to get next image
    let c = UH[UH.length-1]
    console.log(`Going from ${MP[UH[UH.length-1]]}`)
    // Step to multiply with TM
    // Step to multiply with TM
    let picked_category = -Infinity
    let second_picked_category = -Infinity
    let last_value = -Infinity
    let second_last_value = -Infinity
    for(let i=0;i<TM[c].length;i++){
        if((TM[c][i]) > last_value){
            last_value = TM[c][i]
            picked_category = i
        }
    }
    for(let j=0;j<TM[c].length;j++){
        if((TM[c][j]) > second_last_value && TM[c][j]<last_value){
            second_last_value = TM[c][j]
            second_picked_category = j
        }
    }
    console.log(`Going to ${MP[(SC ? second_picked_category:picked_category)]}`)
    return {c,'picked_category':(SC ? second_picked_category:picked_category)}
    }
}

function image_shower(c=null){
 let CN = MP[c]
 console.log(`Image was shown from ${CN}`)
 switch(CN){
    case 'I':
        document.getElementById('cardImage').src = `../static/engine_images/indian/${Math.floor(Math.random()*10)}.jpg`
        break;
    case 'W':
        document.getElementById('cardImage').src = `../static/engine_images/white/${Math.floor(Math.random()*10)}.jpg`
        break;
    case 'A':
        document.getElementById('cardImage').src = `../static/engine_images/asian/${Math.floor(Math.random()*10)}.jpg`
        break;
    case 'L':
        document.getElementById('cardImage').src = `../static/engine_images/latino/${Math.floor(Math.random()*10)}.jpg`
        break;
 }
}

// Initialize the transition matrix
TM_generator();
console.log(TM);

// Generate the first image
let {c, picked_category} = image_generator();

// Update CS based on the picked category
CS_updater(picked_category);
console.log(CS);

// Add the category to user history
UH.push(picked_category);
console.log(UH);

// Show the first image
image_shower(picked_category);
let counter = 0
let second_category_counter = 0

function bias_updater(param = null) {
    // Log the user action
    switch (param) {
        case -1:
            counter += 1
            console.log('Dislike was clicked.');
            break;
        case 1:
            counter = 0
            console.log('Like was clicked.');
            break;
        case 0.5:
            counter = 0
            console.log('Skip was clicked.');
            break;
    }
    if (UH.length > 1) {
        if(counter != 2){
            TM_updater(param, UH[UH.length - 2], UH[UH.length - 1]);
        }
        else{
            TM_updater(param = -2, UH[UH.length - 2], UH[UH.length - 1]);
        }
    }
    
    console.log(TM);

    let picked_category_passed = null
    second_category_counter += 1
    // Generate the next image
    if(second_category_counter == 3){
        let {c, picked_category} = image_generator(SC=true);
        picked_category_passed = picked_category
        second_category_counter = 0
        console.log(`Second cat image was shown ${picked_category}`)
    }
    else{
        let {c, picked_category} = image_generator(SC=false);
        picked_category_passed = picked_category
        console.log(`First cat image was shown ${picked_category}`)
    }

    // Update CS based on the new category
    CS_updater(picked_category_passed);
    console.log(CS);

    // Add the new category to user history
    UH.push(picked_category_passed);
    console.log(UH);

    // Show the new image
    image_shower(picked_category_passed);
}


