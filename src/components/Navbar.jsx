const Navbar= () => {
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
                                
                                <select id="language" name="language" className="rounded-lg border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white outline-none focus:border-slate-400">
                                    <option value="en">English</option>
                                    <option value="hi">Hindi</option>
                                </select>
                            </li>
                        </ul>
                    </div>   
             </div>
                     
        </nav>
    );
};

export default Navbar;