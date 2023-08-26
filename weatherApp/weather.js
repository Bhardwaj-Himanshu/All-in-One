const apiKey = "d120552a6d9f4d9b9bd115831232608";
const weatherData = document.getElementById('weather-data');
const cityinput=document.getElementById('city-input');
const button=document.querySelector('button');

// async function is used with await method
async function getweatherdata(cityvalue){
    try {
        //try and catch to log errors just in case the request is not successful
        // await is used when I want the line to execute and wait for the response from the API server before I execute the line below it.
       const response=await fetch(`http://api.weatherapi.com/v1/current.json?q=${cityvalue}&key=${apiKey}`);
       if(!response.ok){
        throw new Error("I am Error wala constructor!")
       } 
       const resdata= await response.json();//parses or converts the responded data into json file
       console.log(resdata);
       
       const icon=resdata.current.condition.icon;
       const temprature= Math.floor(resdata.current.temp_c);
       const description=resdata.current.condition.text;
       const feelslike=[
        `Feels like:${Math.floor(resdata.current.feelslike_c)}`
       ];
       const humidity=resdata.current.humidity;
       const windspeed=Math.floor((resdata.current.wind_kph)*(5/18));
       
       console.log(`${icon},${temprature},${description},${feelslike},${humidity},${windspeed}`);
    } catch (error) {
       console.log(error);
    }
}

button.addEventListener('click',(e)=>{
    e.preventDefault();
    const cityvalue=cityinput.value;
    console.log(cityvalue);
    getweatherdata(cityvalue);
    document.querySelector('.icon')
})
