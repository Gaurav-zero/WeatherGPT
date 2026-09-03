async function getLocationName(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "WeatherGPT/1.0",
    },
  });

  const data = await response.json();

  console.log("reverse geocoding of place:", data);

  return data;
}

async function getCoordinates(place) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    place
  )}&format=json&limit=1`;

  try{
    const response = await fetch(url, {
      headers: {
        "User-Agent": "WeatherGPT/1.0",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim returned ${response.status}`);
    }

    const data = await response.json();

    console.log("geolocation of entered place is: ", data);

    return data[0] || null;
  }catch(error){
    console.error("Geocoding error:", error);
    throw error;
  }
}

module.exports = {
  getLocationName,
  getCoordinates,
};