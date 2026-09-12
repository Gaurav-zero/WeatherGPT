import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState,useEffect } from "react";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const { status } =
          await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          console.log("Location permission denied");
          return;
        }

        const location =
          await Location.getCurrentPositionAsync({});

        const { latitude, longitude } = location.coords;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        const response = await fetch(
          `http://10.209.91.90:3000/api/weather?lat=${latitude}&lon=${longitude}`
        );

        const weatherData = await response.json();

        console.log("Current location weather:", weatherData);

        setWeather(weatherData);
      } catch (error) {
        console.error("Location/weather error:", error);
      }
    };

    loadWeather();
  }, []);

  const handleSearch = async () => {
    if (!search.trim()) {
      return;
    }

    try {
      console.log("Searching for:", search);

      const locationResponse = await fetch(
        `http://10.209.91.90:3000/api/location/search?place=${encodeURIComponent(search)}`
      );

      const location = await locationResponse.json();

      console.log("Location:", location);

      const lat = location.lat;
      const lon = location.lon;

      const weatherResponse = await fetch(
        `http://10.209.91.90:3000/api/weather?lat=${lat}&lon=${lon}`
      );

      const weatherData = await weatherResponse.json();

      console.log("Weather:", weatherData);

      setWeather(weatherData);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mausam</Text>

      <Text style={styles.subtitle}>
        Your AI-powered weather assistant
      </Text>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search for a city..."
          value={search}
          onChangeText={setSearch}
        />

        <Pressable
          style={styles.searchButton}
          onPress={handleSearch}
        >
          <Text style={styles.searchButtonText}>Search</Text>
        </Pressable>
      </View>

      {weather && (
        <View style={styles.weatherCard}>
          {/* Location */}
          <Text style={styles.city}>
            {weather.location.city}, {weather.location.country}
          </Text>

          {/* Main weather */}
          <View style={styles.mainWeather}>
            <Text style={styles.weatherIcon}>
              {weather.current.icon}
            </Text>

            <View>
              <Text style={styles.temperature}>
                {weather.current.temperature}°
              </Text>

              <Text style={styles.condition}>
                {weather.current.condition}
              </Text>

              <Text style={styles.feelsLike}>
                Feels like {weather.current.feelsLike}°
              </Text>
            </View>
          </View>

          {/* Highlights */}
          <View style={styles.highlights}>
            <View style={styles.highlight}>
              <Text style={styles.highlightLabel}>💧 Humidity</Text>
              <Text style={styles.highlightValue}>
                {weather.current.humidity}%
              </Text>
            </View>

            <View style={styles.highlight}>
              <Text style={styles.highlightLabel}>💨 Wind</Text>
              <Text style={styles.highlightValue}>
                {weather.current.windSpeed} km/h
              </Text>
            </View>

            <View style={styles.highlight}>
              <Text style={styles.highlightLabel}>☀️ UV Index</Text>
              <Text style={styles.highlightValue}>
                {weather.current.uv}
              </Text>
            </View>

            <View style={styles.highlight}>
              <Text style={styles.highlightLabel}>👁 Visibility</Text>
              <Text style={styles.highlightValue}>
                {(weather.current.visibility / 1000).toFixed(1)} km
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 24,
    justifyContent: "center",
  },

  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1e293b",
  },

  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: "#64748b",
  },

  searchContainer: {
    marginTop: 30,
    flexDirection: "row",
    gap: 10,
  },

  input: {
    flex: 1,
    height: 50,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
  },

  searchButton: {
    height: 50,
    paddingHorizontal: 18,
    backgroundColor: "#1e293b",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  searchButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },

  weatherCard: {
  marginTop: 30,
  backgroundColor: "white",
  borderRadius: 20,
  padding: 24,
},

city: {
  fontSize: 20,
  fontWeight: "600",
  color: "#1e293b",
},

mainWeather: {
  marginTop: 24,
  flexDirection: "row",
  alignItems: "center",
  gap: 20,
},

weatherIcon: {
  fontSize: 64,
},

temperature: {
  fontSize: 52,
  fontWeight: "700",
  color: "#1e293b",
},

condition: {
  marginTop: 2,
  fontSize: 18,
  color: "#64748b",
},

feelsLike: {
  marginTop: 4,
  fontSize: 14,
  color: "#94a3b8",
},

highlights: {
  marginTop: 28,
  gap: 16,
},

highlight: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
},

highlightLabel: {
  fontSize: 15,
  color: "#64748b",
},

highlightValue: {
  fontSize: 15,
  fontWeight: "600",
  color: "#1e293b",
},
});