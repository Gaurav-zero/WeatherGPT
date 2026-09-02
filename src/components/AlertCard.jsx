function AlertCard() {
    return (
        <section className="mt-10">

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">

                <div className="flex items-start gap-4">

                    {/* Alert icon */}
                    <div className="text-3xl">
                        ⚠️
                    </div>

                    {/* Alert content */}
                    <div className="flex-1">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-amber-700">
                                    Weather Alert
                                </p>

                                <h2 className="mt-1 text-xl font-bold text-slate-800">
                                    Heavy rainfall expected tomorrow
                                </h2>
                            </div>

                            <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
                                Moderate Risk
                            </span>

                        </div>

                        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                            Rain probability is expected to increase significantly
                            tomorrow evening. Consider avoiding unnecessary outdoor
                            activities and plan travel accordingly.
                        </p>

                    </div>

                </div>

            </div>

        </section>
    );
}

export default AlertCard;