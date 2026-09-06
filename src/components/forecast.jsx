import { data } from "react-router";

function Forecast({forecast}) {
    return (
        <section className="mt-10">

            <div className="mb-5">
                <h2 className="text-2xl font-bold text-slate-800">
                    7-Day Forecast
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Weather outlook for the upcoming week
                </p>
            </div>

            <div className="grid grid-cols-7 gap-4">
                {forecast?.map((day) => (
                    <div
                        key={day.date}
                        className="rounded-2xl bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <p className="font-semibold text-slate-700">
                            {new Date(day.date).toLocaleDateString("en-US", {
                                weekday: "short",
                            })}
                        </p>

                        <div className="my-5 text-4xl">
                            {day.icon}
                        </div>

                        <p className="text-sm text-slate-500">
                            {day.condition}
                        </p>

                        <div className="mt-4">
                            <span className="font-bold text-slate-800">
                                {day.high}°
                            </span>

                            <span className="ml-2 text-slate-400">
                                {day.low}°
                            </span>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    );
}

export default Forecast;