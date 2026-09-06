function generateAlert(forecast) {
    for (const day of forecast) {

        // Thunderstorm
        if (day.weatherCode >= 95 && day.weatherCode <= 99) {
            return {
                type: "Thunderstorm",
                severity: "High",
                title: "Thunderstorm expected",
                description: `Thunderstorm activity is possible on ${day.date}.`,
            };
        }

        // Heavy rain probability
        if (day.rainProbability >= 70) {
            return {
                type: "Heavy Rain",
                severity: "Moderate",
                title: "Heavy rainfall expected",
                description: `There is a ${day.rainProbability}% chance of precipitation on ${day.date}.`,
            };
        }

        // Rain
        if (day.weatherCode >= 51 && day.weatherCode <= 67) {
            return {
                type: "Rain",
                severity: "Low",
                title: "Rain expected",
                description: `Rain is expected on ${day.date}.`,
            };
        }

        // Snow
        if (
            (day.weatherCode >= 71 && day.weatherCode <= 77) ||
            day.weatherCode === 85 ||
            day.weatherCode === 86
        ) {
            return {
                type: "Snow",
                severity: "Moderate",
                title: "Snowfall expected",
                description: `Snowfall is possible on ${day.date}.`,
            };
        }
    }

    return null;
}

module.exports = {
    generateAlert,
};