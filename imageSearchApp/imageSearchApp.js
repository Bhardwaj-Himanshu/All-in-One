const APIKEY="JGcW2u10bRIRaLn3jxRLhWilryp7spwPW6OWdqah4EU";
const inputdataEl=document.querySelector("#input-data");
const actionButton=document.querySelector("#action-button");
const showMore=document.querySelector('.show-more');
//jotting down the steps
let page=1;
const containersbox=document.querySelector("#containers");
containersbox.innerHTML='';

//Need to first fetch the Api url with query parameters and API_ID inside a async function which is being called when a button is being clicked!
async function fetchdata(){
    const inputvalue=inputdataEl.value;
    const url=`https://api.unsplash.com/search/photos/?query=${inputvalue}&page=${page}&client_id=${APIKEY}`;
    console.log(url);
    const response=await fetch(url);
    const resdata=await response.json();
    console.log(resdata);
    const result_=resdata.results;

    document.querySelector('.show-more').style.display='inline-block';
        
        result_.map((item)=>{
            const seprateContainer=document.createElement('div');
            seprateContainer.classList.add('seprate-container');
            //create img section
            const image=document.createElement('img');
            //image src
            image.src=item.urls.small;
            image.alt=item.alt_description;
            //create anchor section
            const anchorElement=document.createElement('a');
            anchorElement.href=item.links.html;
            anchorElement.target="_blank";
            anchorElement.innerText=item.alt_description;
        
            seprateContainer.appendChild(image);
            seprateContainer.appendChild(anchorElement);
            containersbox.appendChild(seprateContainer);
            console.log(item);
        })
    
}
    
actionButton.addEventListener('click',(e)=>{
 e.preventDefault();
 fetchdata();
})

showMore.addEventListener('click',()=>{
    page=page+1;
    fetchdata();
})

