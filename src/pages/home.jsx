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

            </section>

        </main>
    );
}

export default Home;