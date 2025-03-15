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
    if (UH.length === 1) return null;

    let change = (UB === 1) ? 0.15 : (UB === 0.5) ? 0.09 : -0.15;
    let reduce = (UB === 1) ? 0.05 : (UB === 0.5) ? 0.03 : -0.05;

    if (f !== t) {
        TM[f][t] = TM[f][t] + change
        TM[f][f] = TM[f][f] + change

        for (let i = 0; i < TM[f].length; i++) {
            if (i !== t && i !== f) {
                TM[f][i] = TM[f][i] - reduce;
            }
        }
    } else {
        TM[f][f] = 0, TM[f][f] + change;
        
        for (let i = 0; i < TM[f].length; i++) {
            if (i !== f) {
                TM[f][i] = TM[f][i] - reduce;
            }
        }
    }

}


// returns None
function CS_updater(param=null){
 CS = [0,0,0,0]
 CS[param] = 1
}

// returns picked category
function image_generator(){
    if (UH.length == 0) {
    //  then change the CS to turn any category into 1 and multiply with TM to pick the next image
    let c = Math.floor(Math.random()*4)
    CS[c] = 1
    console.log(`Going from ${MP[c]}`)
    // Step to multiply with TM
    let picked_category = -Infinity
    let last_value = -Infinity
    for(let i=0;i<TM[c].length;i++){
        if((TM[c][i]) > last_value){
            last_value = TM[c][i]
            picked_category = i
        }
    }
    console.log(`Going to ${MP[picked_category]}`)
    return {c,picked_category}
    }
    else{
    // We have UH then directly multiply with TM to get next image
    let c = UH[UH.length-1]
    console.log(`Going from ${MP[UH[UH.length-1]]}`)
    // Step to multiply with TM
    let picked_category = -Infinity
    let last_value = -Infinity
    for(let i=0;i<TM[c].length;i++){
        if((TM[c][i]) > last_value){
            last_value = TM[c][i]
            picked_category = i
        }
    }
    console.log(`Going to ${MP[picked_category]}`)
    return {c,picked_category}
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

function bias_updater(param = null) {
    // Log the user action
    switch (param) {
        case -1:
            console.log('Dislike was clicked.');
            break;
        case 1:
            console.log('Like was clicked.');
            break;
        case 0.5:
            console.log('Skip was clicked.');
            break;
    }

    // Generate the next image
    let {c, picked_category} = image_generator();

    // Update CS based on the new category
    CS_updater(picked_category);
    console.log(CS);

    // Add the new category to user history
    UH.push(picked_category);
    console.log(UH);

    // Show the new image
    image_shower(picked_category);

    if (UH.length > 1) {
        TM_updater(param, UH[UH.length - 2], UH[UH.length - 1]);
    }
    
    console.log(TM);
}


