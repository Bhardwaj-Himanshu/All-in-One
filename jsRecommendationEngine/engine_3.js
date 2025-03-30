function bias_updater(param=null){
    switch(param){
        case 1:
            console.log('Like was clicked')
            break;
        case -1:
            console.log('Dislike was clicked')
            break;
        case 0.5:
            console.log('Skip was clicked')
            break;
    }
}