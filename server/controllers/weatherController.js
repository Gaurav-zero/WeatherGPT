function getWeatherCondition(code) {
  if (code === 0) return "Clear Sky";

  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";

  if (code === 45 || code === 48) return "Fog";

  if (code >= 51 && code <= 57) return "Drizzle";

  if (code >= 61 && code <= 67) return "Rain";

  if (code >= 71 && code <= 77) return "Snow";

  if (code >= 80 && code <= 82) return "Rain Showers";

  if (code === 85 || code === 86) return "Snow Showers";

  if (code >= 95 && code <= 99) return "Thunderstorm";

  return "Unknown";
}

async function getWeatherInfo(req,res){
    const {lat, lon} = req.query;

    const url= `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;

    const response= await fetch(url);
    const data= await response.json();

    const currentWeather = {
        temperature: data.current.temperature_2m,
        feelsLike: data.current.apparent_temperature,
        humidity: data.current.relative_humidity_2m,
        windSpeed: data.current.wind_speed_10m,
        condition: getWeatherCondition(data.current.weather_code),
    };

    const forecast = data.daily.time.map((date, index) => {
        return {
            date: date,
            high: data.daily.temperature_2m_max[index],
            low: data.daily.temperature_2m_min[index],
            condition: getWeatherCondition(data.daily.weather_code[index]),
            rainProbability:
            data.daily.precipitation_probability_max[index],
        };
    });

    res.json({
        location: {
            latitude: Number(lat),
            longitude: Number(lon),
        },
        current: currentWeather,
        forecast: forecast,
    });
}

module.exports= {
    getWeatherInfo,
}