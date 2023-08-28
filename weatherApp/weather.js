const apiKey = "d120552a6d9f4d9b9bd115831232608";
const weatherData = document.getElementById('weather-data');
const cityinput = document.getElementById('city-input');
const button = document.querySelector('.async-button');

const div = document.querySelectorAll('.weather-data .more-information div');
div.forEach((item) => {
    item.style.opacity = '0';
})
button.addEventListener('click', async (e) => {
    e.preventDefault();
    div.forEach((item) => {
        item.style.opacity = '1';
    })
    const cityvalue = cityinput.value;
if (cityvalue) {
        try {
            //try and catch to log errors just in case the request is not successful
            // await is used when I want the line to execute and wait for the response from the API server before I execute the line below it.
            const response = await fetch(`https://api.weatherapi.com/v1/current.json?q=${cityvalue}&key=${apiKey}`);
            //logs error in console--not needed but helpful
            if (!response.ok) {
                throw new Error("Enter a valid city/Bad network");
            }
            const resdata = await response.json();//parses or converts the responded data into json file
            console.log(resdata);

            const icon = resdata.current.condition.icon;
            const temperature = Math.floor(resdata.current.temp_c);
            const description = resdata.current.condition.text;
            const desDivs = [
                `Feels like:${Math.floor(resdata.current.feelslike_c)} °C`,
                `Humidity:${resdata.current.humidity} %`,
                `Wind speed: ${Math.floor((resdata.current.wind_kph) * (5 / 18))} m/s`
            ];

            document.querySelector('.icon').innerHTML = `<img src="${icon}" alt="Weather Icon">`;
            document.querySelector('.temperature').textContent = `${temperature}`;
            document.querySelector('.description').textContent = `${description}`;
            const moreinformation = document.querySelector('.more-information');
            /*moreinformation.children[0].innerHTML = `<div>${desDivs[0]}</div>`;
            moreinformation.children[1].innerHTML = `<div>${desDivs[1]}</div>`;
            moreinformation.children[2].innerHTML = `<div>${desDivs[2]}</div>`;*/

            // Create new elements for each piece of information
            const feelsLikeDiv = document.createElement('div');
            feelsLikeDiv.textContent = desDivs[0];
            const humidDiv = document.createElement('div');
            humidDiv.textContent = desDivs[1];
            const windSpeedDiv = document.createElement('div');
            windSpeedDiv.textContent = desDivs[2];
            
            // Clear and update .more-information content
            moreinformation.innerHTML = '';
            moreinformation.appendChild(feelsLikeDiv);
            moreinformation.appendChild(humidDiv);
            moreinformation.appendChild(windSpeedDiv);
        }
        catch (error) {
            document.querySelector('.icon').innerHTML = ``;
            document.querySelector('.temperature').textContent = ``;
            document.querySelector('.description').textContent = `Enter a valid city/API error.`;
            document.querySelector('.more-information').innerHTML=``;
        }
    }
/*else{
            document.querySelector('.icon').innerHTML = ``;
            document.querySelector('.temperature').textContent = ``;
            document.querySelector('.description').textContent = `Enter a valid city!`;
            document.querySelector('.more-information').innerHTML=``; 
    }*/ //unable to render this on page!
})


