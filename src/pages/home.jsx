import Forecast from "../components/forecast";
import AlertCard from "../components/AlertCard";
import ChatBox from "../components/ChatBox";
import Footer from "../components/Footer";

import { useEffect, useState } from "react";




function Home(){
    const [weather, setWeather]= useState(null);
    const [search, setSearch]= useState("");

    const handleSearch = () => {
        fetch(
            `http://localhost:3000/api/location/search?place=${encodeURIComponent(search)}`
        )
            .then((response) => response.json())
            .then((location) => {
            console.log("Location:", location);

            const lat = location.lat;
            const lon = location.lon;

            return fetch(
                `http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`
            );
            })
            .then((response) => response.json())
            .then((data) => {
            console.log("Weather:", data);
            setWeather(data);
            })
            .catch((error) => {
            console.error("Search error:", error);
            });
        };

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) =>{
            console.log("Current location:",position);

            const lat= position.coords.latitude;
            const lon= position.coords.longitude;

            console.log("latitude:", lat);
            console.log("longitude:", lon);

            fetch(`http://localhost:3000/api/weather?lat=${lat}&lon=${lon}`)
                .then((response) => {
                    console.log("Response:", response);
                    return response.json();
                })
                .then((data) => {
                    console.log("Weather data:", data);
                    setWeather(data);
                })
                .catch((error) => {
                    console.error("Fetch error:", error);
                    });
        },
        (error) => {
            console.error("Location error:", error);
        }
    );      
   }, []);

    return (
        <main className="min-h-screen bg-slate-50">
            
            <section className="mx-auto max-w-7xl px-6 py-10">

                <h1 className="text-3xl font-bold text-slate-800">
                    Good afternoon 👋 
                </h1>

                <p className="mt-2 text-slate-500">
                    What is the weather looking like today?
                </p>

                <div className="mt-8 flex max-w-3xl items-center rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">

                    <span className="mr-3 text-xl">
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search for a city..."
                        className="flex-1 bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <button onClick={handleSearch} className="rounded-lg bg-slate-800 px-5 py-2 font-medium text-white transition hover:bg-slate-700">
                        Search
                    </button>

                </div>

                <div className="mt-10 grid grid-cols-3 gap-6">

                    {/* Current Weather */}
                    <div className="col-span-2 rounded-2xl bg-white p-8 shadow-sm">
                        <div className="flex items-start justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Current Weather
                                </p>

                                <h2 className="mt-1 text-2xl font-bold text-slate-800">
                                    {weather
                                        ? `${weather.location.city}, ${weather.location.country}`
                                            : "Finding your location..."}
                                </h2>

                                {weather?.location.suburb && (
                                     <p className="mt-1 text-sm text-slate-400">
                                        {weather?.location.suburb}
                                    </p>
                                )}
                               
                            </div>

                            <p className="text-sm text-slate-400">
                                Today
                            </p>

                        </div>

                        <div className="mt-8 flex items-center gap-8">

                            <div className="text-7xl">
                                {weather?.current.icon}
                            </div>

                            <div>
                                <p className="text-6xl font-bold text-slate-800">
                                    {weather?.current.temperature}°
                                </p>

                                <p className="mt-2 text-lg text-slate-500">
                                    {weather?.current.condition}
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Feels like {weather?.current.feelsLike}°
                                </p>
                            </div>

                        </div>
                    </div>


                    {/* Today's Highlights */}
                    <div className="rounded-2xl bg-white p-8 shadow-sm">

                        <p className="text-sm font-medium text-slate-500">
                            Today's Highlights
                        </p>

                        <div className="mt-6 space-y-6">

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    💧 Humidity
                                </span>

                                <span className="font-semibold text-slate-800">
                                    {weather?.current.humidity}%
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    💨 Wind
                                </span>

                                <span className="font-semibold text-slate-800">
                                    {weather?.current.windSpeed} km/h
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    ☀️ UV Index
                                </span>

                                <span className="font-semibold text-slate-800">
                                    {weather?.current.uv}
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    👁️ Visibility
                                </span>

                                <span className="font-semibold text-slate-800">
                                    {(weather?.current.visibility / 1000).toFixed(1)} km
                                </span>
                            </div>

                        </div>
                    </div>

                </div>


                <Forecast forecast={weather?.forecast} />
                <AlertCard />
                <ChatBox />
                <Footer />

            </section>

        </main>
    );
}

export default Home;