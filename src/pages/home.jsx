import Forecast from "../components/forecast";
import AlertCard from "../components/AlertCard";
import ChatBox from "../components/ChatBox";
import Footer from "../components/Footer";

function Home(){
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
                    />

                    <button className="rounded-lg bg-slate-800 px-5 py-2 font-medium text-white transition hover:bg-slate-700">
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
                                    Lucknow, India
                                </h2>
                            </div>

                            <p className="text-sm text-slate-400">
                                Today
                            </p>

                        </div>

                        <div className="mt-8 flex items-center gap-8">

                            <div className="text-7xl">
                                ☀️
                            </div>

                            <div>
                                <p className="text-6xl font-bold text-slate-800">
                                    31°
                                </p>

                                <p className="mt-2 text-lg text-slate-500">
                                    Mostly Sunny
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    Feels like 34°
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
                                    68%
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    💨 Wind
                                </span>

                                <span className="font-semibold text-slate-800">
                                    14 km/h
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    ☀️ UV Index
                                </span>

                                <span className="font-semibold text-slate-800">
                                    7
                                </span>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-slate-500">
                                    👁️ Visibility
                                </span>

                                <span className="font-semibold text-slate-800">
                                    8 km
                                </span>
                            </div>

                        </div>
                    </div>

                </div>


                <Forecast />
                <AlertCard />
                <ChatBox />
                <Footer />

            </section>

        </main>
    );
}

export default Home;