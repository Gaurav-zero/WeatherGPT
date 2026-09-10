import { useState,useRef } from "react";
import ReactMarkdown from "react-markdown";

const cleanTextForSpeech = (text) => {
    return text
        .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold
        .replace(/\*(.*?)\*/g, "$1")     // remove italic
        .replace(/#{1,6}\s?/g, "")        // remove headings
        .replace(/[-*]\s/g, "")           // remove bullet markers
        .replace(/`{1,3}/g, "")           // remove code backticks
        .trim();
};

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

function ChatBox({ weather, language, setLanguage, t }) {
    const [message, setMessage]= useState("");
    const [messages, setMessages]= useState([]);
    const [isListening, setIsListening]= useState(false);
    const [isVoiceInput, setIsVoiceInput] = useState(false);
    const recognitionRef= useRef(null);

    const handleAgriculture = async () => {
            try {
                const response = await fetch("http://localhost:3000/api/chat", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        action: "agriculture",
                        weather,
                        messages,
                        language,
                    }),
                });

                const data = await response.json();

                const aiMessage = {
                    role: "assistant",
                    content: data.reply,
                };

                setMessages((prev) => [...prev, aiMessage]);

                const speechText = cleanTextForSpeech(data.reply);
                const speech = new SpeechSynthesisUtterance(speechText);
                speech.lang = languages.find(
                    (lang) => lang.value === language
                )?.speechCode || "en-IN";

                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(speech);

            } catch (error) {
                console.error("Agriculture error:", error);
            }
        };
    

    const handleVoiceInput= () => {
        const SpeechRecognition= window.SpeechRecognition || window.webkitSpeechRecognition;

        if(!SpeechRecognition){
            alert("Speech recognition is not supported in this browser");
            return;
        }

        if(isListening){
            recognitionRef.current?.stop();
            return;
        }

        const recognition= new SpeechRecognition();

        const selectedLanguage = languages.find(
            (lang) => lang.value === language
        );

        recognition.lang = selectedLanguage.speechCode;
        recognition.continuous=false;
        recognition.interimResults=false;

        recognition.onstart= () =>{
            setIsListening(true);
        };

        recognition.onresult= (event) =>{
            const transcript= event.results[0][0].transcript;

            console.log("Voice input:", transcript);

            setMessage(transcript);
            setIsVoiceInput(true);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current= recognition;

        recognition.start();
    }

    const handleSend=  async(userInput = message)=>{
        if(!userInput.trim()) return;

        console.log("User asked:", userInput);

        const userMessage={
            role:"user",
            content:userInput,
        };

        setMessages((prev) => [...prev, userMessage]);

        try{
            const response= await fetch("http://localhost:3000/api/chat", {
                method:"POST",
                headers:{
                    "Content-Type": "application/json", 
                },
                body: JSON.stringify({
                    message: userInput,
                    weather,
                    messages,
                    language,
                }),
            });

            const data= await response.json();

            const aiMessage={
                role:"assistant",
                content:data.reply,
            };

            console.log("Server response:", data);

            setMessages((prev) => [...prev, aiMessage]);

            const speechText= cleanTextForSpeech(data.reply);

            if (isVoiceInput) {
                const speechText = cleanTextForSpeech(data.reply);

                const speech = new SpeechSynthesisUtterance(speechText);

                speech.lang =
                    languages.find((lang) => lang.value === language)?.speechCode
                    || "en-IN";

                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(speech);
            }
        }catch(error){
            console.error("Chat error:", error);
        }
        
        setMessage("");
        setIsVoiceInput(false);
    };


    return (
        <section className="mt-10">
            <div className="rounded-2xl bg-slate-800 px-10 py-12">

                {/* Heading */}
                <div className="text-center">
                    {/* <p className="text-sm font-semibold tracking-wider text-blue-300">
                        AI WEATHER ASSISTANT
                    </p> */}

                    <h2 className="mt-2 text-3xl font-bold text-white">
                        {t.title}
                    </h2>

                    <p className="mx-auto mt-3 max-w-2xl text-slate-300">
                        {t.description}
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
                                    <ReactMarkdown>
                                        {msg.content}
                                    </ReactMarkdown>
                                    
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
                        onChange={(e) => {
                            setMessage(e.target.value);
                            setIsVoiceInput(false);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                handleSend();
                            }
                        }}
                        placeholder={t.placeholder}
                        className="flex-1 bg-transparent px-4 py-3 text-slate-700 outline-none placeholder:text-slate-400"
                    />

                    <button
                        onClick={handleVoiceInput}
                        className={`mr-2 rounded-lg px-4 py-3 font-medium text-white transition ${
                            isListening
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-slate-600 hover:bg-slate-700"
                        }`}
                    >
                        {isListening ? "🛑" : "🎤"}
                    </button>

                    <button
                        onClick={handleSend}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                    >
                        {t.ask}
                    </button>

                </div>


                {/* Suggested questions */}
                <div className="mt-5 flex justify-center gap-3">

                    <button className="rounded-full bg-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-600">
                        🌧️ {t.rainForecast}
                    </button>

                    <button className="rounded-full bg-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-600">
                        ✈️ {t.flightWeather}
                    </button>

                    <button
                        onClick={handleAgriculture}
                        className="rounded-full bg-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:bg-slate-600"
                    >
                        🌾 {t.agriculture}
                    </button>

                </div>

            </div>
        </section>
    );
}

export default ChatBox;