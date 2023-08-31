const APIKEY="JGcW2u10bRIRaLn3jxRLhWilryp7spwPW6OWdqah4EU";
const inputdata=document.querySelector("#input-data");
const actionButton=document.querySelector("#action-button");
//jotting down the steps
let page=1;
document.querySelectorAll(".containers").forEach(container=>{
    container.innerHTML='';
});

//Need to first fetch the Api url with query parameters and API_ID inside a async function which is being called when a button is being clicked!
async function fetchdata(){
    const inputvalue=inputdata.value;
    const url=`https://api.unsplash.com/search/photos/?query=${inputvalue}&page=${page}&client_id=${APIKEY}`;
    console.log(url);
    const response=await fetch(url);
    const resdata=response.json();
    console.log(resdata);
}

actionButton.addEventListener('click',(e)=>{
 e.preventDefault();
 fetchdata();
})

