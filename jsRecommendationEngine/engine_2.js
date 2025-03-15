// This will be the engine 2 somewhat smarter Markov chain principle.
let MP = {'I':0,'W':0,'A':0,'B':0}

let UH = []

let TM = []

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

TM_generator()
console.log(TM)