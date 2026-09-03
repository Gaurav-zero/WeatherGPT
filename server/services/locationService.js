async function getLocationName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "WeatherGPT/1.0",
    },
  });

  const data = await response.json();

  return data;
}

module.exports = {
  getLocationName,
};