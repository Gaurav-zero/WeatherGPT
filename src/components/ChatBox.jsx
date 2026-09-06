import { useState } from "react";

function ChatBox({weather}) {
    const [message, setMessage]= useState("");
    const [messages, setMessages]= useState([]);

    const handleSend=  async()=>{
        if(!message.trim()) return;

        console.log("User asked:", message);

        const userMessage={
            role:"user",
            content:message,
        };

        setMessages((prev) => [...prev, userMessage]);

        try{
            const response= await fetch("http://localhost:3000/api/chat", {
                method:"POST",
                headers:{
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({
                    message,
                    weather,
                }),
            });

            const data= await response.json();

            const aiMessage={
                role:"assistant",
                content:data.reply,
            };

            console.log("Server response:", data);

            setMessages((prev) => [...prev, aiMessage]);
        }catch(error){
            console.error("Chat error:", error);
        }
        
        setMessage("");
    };


    return (
        <section className="mt-10">
            <div className="rounded-2xl bg-slate-800 px-10 py-12">

                {/* Heading */}
                <div className="text-center">
                    <p className="text-sm font-semibold tracking-wider text-blue-300">
                        AI WEATHER ASSISTANT
                    </p>

                    <h2 className="mt-2 text-3xl font-bold text-white">
                        Ask WeatherGPT
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-slate-300">
                        Ask questions about weather, forecasts, travel,
                        outdoor activities, agriculture and more.
                    </p>
                </div>

                {messages.length > 0 && (
                    <div className="mt-6 space-y-4">

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                                        msg.role === "user"
                                            ? "bg-slate-800 text-white"
                                            : "bg-slate-100 text-slate-800"
                                    }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}

                    </div>
                )}


                {/* Chat input */}
                <div className="mx-auto mt-8 flex max-w-3xl rounded-xl bg-white p-2">

                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                        placeholder="Will I need an umbrella tomorrow?"
                        className="flex-1 bg-transparent px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400"
                    />

                    <button
                        onClick={handleSend}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        Ask
                    </button>

                </div>


                {/* Suggested questions */}
                <div className="mt-5 flex justify-center gap-3">

                    <button className="rounded-full bg-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-600">
                        🌧️ Rain forecast
                    </button>

                    <button className="rounded-full bg-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-600">
                        ✈️ Flight weather
                    </button>

                    <button className="rounded-full bg-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-600">
                        🌾 Agriculture
                    </button>

                </div>

            </div>
        </section>
    );
}

export default ChatBox;