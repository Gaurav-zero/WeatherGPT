import { FlatList,Pressable, ScrollView,StyleSheet, Text, TextInput, View } from "react-native";
import { useState,useEffect } from "react";
import * as Location from "expo-location";

export default function HomeScreen() {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

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

  const handleSendMessage = async () => {
      if (!message.trim() || !weather) return;

      const userMessage = message.trim();

      const newMessages = [
        ...messages,
        {
          role: "user" as const,
          content: userMessage,
        },
      ];

      setMessages(newMessages);
      setMessage("");
      setIsChatLoading(true);

      try {
        const response = await fetch("http://10.209.91.90:3000/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: userMessage,
            weather: weather,
            messages: messages,
            language: "en",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to get response");
        }

        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: data.reply,
          },
        ]);
      } catch (error) {
        console.error("Chat error:", error);

        setMessages([
          ...newMessages,
          {
            role: "assistant",
            content: "Sorry, I couldn't get a response right now.",
          },
        ]);
      } finally {
        setIsChatLoading(false);
      }
    };

  const handleSearch = async () => {
    if (!search.trim()) {
      return;
    }

    try {
      setIsLoading(true);
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
      setSearch("");
    } catch (error) {
      console.error("Search error:", error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
          disabled={isLoading}
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

      {weather && (
          <View style={styles.forecastSection}>
            <Text style={styles.sectionTitle}>7-Day Forecast</Text>

            <FlatList
              data={weather.forecast}
              keyExtractor={(item) => item.date}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.forecastList}
              renderItem={({ item }) => (
                <View style={styles.forecastCard}>
                  <Text style={styles.forecastDay}>
                    {new Date(item.date).toLocaleDateString("en-US", {
                      weekday: "short",
                    })}
                  </Text>

                  <Text style={styles.forecastIcon}>
                    {item.icon}
                  </Text>

                  <Text style={styles.forecastCondition}>
                    {item.condition}
                  </Text>

                  <View style={styles.temperatures}>
                    <Text style={styles.high}>
                      {item.high}°
                    </Text>

                    <Text style={styles.low}>
                      {item.low}°
                    </Text>
                  </View>

                  <Text style={styles.rain}>
                    💧 {item.rainProbability}%
                  </Text>
                </View>
              )}
            />
          </View>
        )}

        <View style={styles.chatSection}>
            <Text style={styles.sectionTitle}>Mausam Assistant</Text>

            <View style={styles.messagesContainer}>
              {messages.length === 0 ? (
                <Text style={styles.emptyChat}>
                  Ask me anything about the weather.
                </Text>
              ) : (
                messages.map((msg, index) => (
                  <View
                    key={index}
                    style={[
                      styles.messageBubble,
                      msg.role === "user"
                        ? styles.userBubble
                        : styles.assistantBubble,
                    ]}
                  >
                    <Text style={styles.messageText}>
                      {msg.content}
                    </Text>
                  </View>
                ))
              )}

              {isChatLoading && (
                <Text style={styles.loadingText}>
                  WeatherGPT is thinking...
                </Text>
              )}
            </View>

            <View style={styles.inputRow}>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Ask about the weather..."
                style={styles.chatInput}
                multiline
              />

              <Pressable
                onPress={handleSendMessage}
                style={styles.sendButton}
                disabled={isChatLoading}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
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

forecastSection: {
  marginTop: 30,
},

sectionTitle: {
  fontSize: 22,
  fontWeight: "700",
  color: "#1e293b",
  marginBottom: 14,
},

forecastList: {
  gap: 12,
},

forecastCard: {
  width: 130,
  backgroundColor: "white",
  borderRadius: 18,
  padding: 16,
  alignItems: "center",
},

forecastDay: {
  fontSize: 15,
  fontWeight: "600",
  color: "#64748b",
},

forecastIcon: {
  fontSize: 36,
  marginTop: 12,
},

forecastCondition: {
  fontSize: 13,
  color: "#64748b",
  textAlign: "center",
  marginTop: 8,
  minHeight: 34,
},

temperatures: {
  flexDirection: "row",
  gap: 8,
  marginTop: 12,
},

high: {
  fontSize: 16,
  fontWeight: "700",
  color: "#1e293b",
},

low: {
  fontSize: 16,
  color: "#94a3b8",
},

rain: {
  marginTop: 10,
  fontSize: 13,
  color: "#64748b",
},
chatSection: {
  marginTop: 24,
  marginBottom: 30,
},

sectionTitle: {
  fontSize: 22,
  fontWeight: "700",
  marginBottom: 12,
},

messagesContainer: {
  gap: 10,
  marginBottom: 12,
},

emptyChat: {
  color: "#777",
  fontSize: 15,
  paddingVertical: 20,
},

messageBubble: {
  maxWidth: "85%",
  padding: 12,
  borderRadius: 14,
},

userBubble: {
  alignSelf: "flex-end",
  backgroundColor: "#007AFF",
},

assistantBubble: {
  alignSelf: "flex-start",
  backgroundColor: "#EAEAEA",
},

messageText: {
  fontSize: 15,
  color: "#111",
},

loadingText: {
  fontSize: 14,
  color: "#777",
  marginTop: 4,
},

inputRow: {
  flexDirection: "row",
  alignItems: "flex-end",
  gap: 8,
},

chatInput: {
  flex: 1,
  minHeight: 48,
  maxHeight: 100,
  borderWidth: 1,
  borderColor: "#CCC",
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 10,
  fontSize: 15,
},

sendButton: {
  backgroundColor: "#007AFF",
  paddingHorizontal: 16,
  paddingVertical: 14,
  borderRadius: 12,
},

sendButtonText: {
  color: "#FFF",
  fontWeight: "600",
},
});