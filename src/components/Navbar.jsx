const languages = [
    { name: "English", value: "en", speechCode: "en-IN" },
    { name: "हिन्दी", value: "hi", speechCode: "hi-IN" },
    { name: "বাংলা", value: "bn", speechCode: "bn-IN" },
    { name: "मराठी", value: "mr", speechCode: "mr-IN" },
    { name: "తెలుగు", value: "te", speechCode: "te-IN" },
    { name: "தமிழ்", value: "ta", speechCode: "ta-IN" },
    { name: "ગુજરાતી", value: "gu", speechCode: "gu-IN" },
    { name: "ಕನ್ನಡ", value: "kn", speechCode: "kn-IN" },
    { name: "മലയാളം", value: "ml", speechCode: "ml-IN" },
    { name: "ਪੰਜਾਬੀ", value: "pa", speechCode: "pa-IN" },
    { name: "ଓଡ଼ିଆ", value: "or", speechCode: "or-IN" },
];

const Navbar= ({language,setLanguage,t}) => {
    return (
        <nav className="w-full border-b border-slate-700 bg-slate-800">
                <div className="flex items-center justify-between px-6 py-4">
                    <div className="navbar-left">
                        <a href="/" className="text-2xl font-bold text-white">
                            WeatherGPT
                        </a>
                    </div>

                    <div className="">
                        <ul className="flex items-center gap-8">
                            <li>
                                <a href="/forecast" className="text-slate-200 transition hover:text-white">Forecast</a>
                            </li>

                            <li>
                                <a href="/alerts" className="text-slate-200 transition hover:text-white">Alerts</a>
                            </li>

                            <li>
                                
                                <select
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="rounded-lg bg-white px-1 py-1 text-black outline-none"
                                >
                                    {languages.map((lang) => (
                                        <option key={lang.value} value={lang.value}>
                                            {lang.name}
                                        </option>
                                    ))}
                                </select>
                            </li>
                        </ul>
                    </div>   
             </div>
                     
        </nav>
    );
};

export default Navbar;