const { getLocationName, getCoordinates } = require("../services/locationService");
const {generateAlert}= require("../services/alertService");

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

function getWeatherIcon(code) {
  if (code === 0) return "☀️";

  if (code === 1) return "🌤️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";

  if (code === 45 || code === 48) return "🌫️";

  if (code >= 51 && code <= 57) return "🌦️";

  if (code >= 61 && code <= 67) return "🌧️";

  if (code >= 71 && code <= 77) return "🌨️";

  if (code >= 80 && code <= 82) return "🌦️";

  if (code === 85 || code === 86) return "🌨️";

  if (code >= 95 && code <= 99) return "⛈️";

  return "🌡️";
}

async function getWeatherInfo(req,res){
    const {lat, lon} = req.query;

    const locationData= await getLocationName(lat,lon);

    const city= locationData.address.city || locationData.address.state_district || locationData.address.town || locationData.address.county || locationData.address.village|| "Unknown";

    const suburb =
        locationData.address.suburb ||
        locationData.address.neighbourhood ||
        "";

    const url= `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code,uv_index,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    
    console.log("Weather URL:", url);
    
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Open-Meteo returned ${response.status}`);
        }

        const data = await response.json();

        const currentWeather = {
            temperature: data.current.temperature_2m,
            feelsLike: data.current.apparent_temperature,
            humidity: data.current.relative_humidity_2m,
            windSpeed: data.current.wind_speed_10m,
            condition: getWeatherCondition(data.current.weather_code),
            icon: getWeatherIcon(data.current.weather_code),
            uv: data.current.uv_index,
            visibility: data.current.visibility,
        };

        const forecast = data.daily.time.map((date, index) => {
            return {
                date: date,
                high: data.daily.temperature_2m_max[index],
                low: data.daily.temperature_2m_min[index],
                condition: getWeatherCondition(data.daily.weather_code[index]),
                icon: getWeatherIcon(data.daily.weather_code[index]),
                rainProbability:
                      data.daily.precipitation_probability_max[index],
                weatherCode: data.daily.weather_code[index],
            };
        });

        const alert= generateAlert(forecast);

        res.json({
                location: {
                    latitude: Number(lat),
                    longitude: Number(lon),
                    city: city,
                    state: locationData.address.state,
                    country: locationData.address.country,
                    suburb: suburb
                },
                current: currentWeather,
                forecast: forecast,
                alert: alert,
        });
        } catch (error) {
            console.error("Weather API error:", error);
            console.error("Cause:", error.cause);

            return res.status(500).json({
                error: "Unable to fetch weather data",
            });
        }

    
}

async function searchLocation(req, res) {
  try {
    const { place } = req.query;

    if (!place) {
      return res.status(400).json({
        error: "Place is required",
      });
    }

    const location = await getCoordinates(place);

    if (!location) {
      return res.status(404).json({
        error: "Location not found",
      });
    }

    res.json(location);
  } catch (error) {
    console.error("Search location error:", error);

    res.status(500).json({
      error: "Unable to search location",
    });
  }
}

module.exports= {
    getWeatherInfo,
    searchLocation,
}