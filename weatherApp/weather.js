/*const apiKey = "d120552a6d9f4d9b9bd115831232608";
const weatherData = document.getElementById('weather-data');
const cityinput=document.getElementById('city-input');
const button=document.querySelector('button');

document.querySelector('.weather-data').style.opacity='0';
// async function is used with await method
async function getweatherdata(cityvalue){
    try {
        //try and catch to log errors just in case the request is not successful
        // await is used when I want the line to execute and wait for the response from the API server before I execute the line below it.
       const response=await fetch(`https://api.weatherapi.com/v1/current.json?q=${cityvalue}&key=${apiKey}`);
       if(!response.ok){
        throw new Error("Enter a valid city/Bad network")
       } 
       const resdata= await response.json();//parses or converts the responded data into json file
       console.log(resdata);
       
       const icon=resdata.current.condition.icon;
       const temperature= Math.floor(resdata.current.temp_c);
       const description=resdata.current.condition.text;
       const feelslike=[
        `Feels like:${Math.floor(resdata.current.feelslike_c)} °C`,
        `Humid is like:${resdata.current.humidity} %`,
        `Wind speed: ${Math.floor((resdata.current.wind_kph)*(5/18))} m/s`
       ];
       return {
        icon:icon,temperature:temperature,description:description,feelslike:feelslike[0],humidity:feelslike[1],windspeed:feelslike[2]
       };
    } 
    catch (error) {
       const weatherdata=document.querySelector('.weather-data');
       weatherdata.innerHTML=`Enter a valid value!`;
    }
}
function collection(weatherData){
    document.querySelector('.icon').innerHTML=`<img src="${weatherData.icon}" alt="Weather Icon">`;
    document.querySelector('.temperature').innerHTML=`${weatherData.temperature}`;
    document.querySelector('.description').innerHTML=`${weatherData.description}`;
    const moreinformation=document.querySelector('.more-information');
    moreinformation.children[0].textContent=weatherData.feelslike;
    moreinformation.children[1].textContent=weatherData.humidity;
    moreinformation.children[2].textContent=weatherData.windspeed;
}

button.addEventListener('click',async (e)=>{
    e.preventDefault();
    document.querySelector('.weather-data').style.opacity='1';
    const cityvalue=cityinput.value;
    console.log(cityvalue);
    const weatherdata= await getweatherdata(cityvalue);
    collection(weatherdata);
})*/
