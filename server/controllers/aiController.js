const OpenAI= require("openai");
const {GoogleGenAI} = require("@google/genai");

require("dotenv").config();

const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const ai= new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function manageAI(req,res){
    try{
        const {message,weather, messages}= req.body;

        console.log("User message:", message);
        console.log("Weather data received:", weather);

        const conversation = messages.map((msg) => ({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [
                {
                    text: msg.content,
                },
            ],
        }));

        // const prompt = `
        //     You are WeatherGPT, a helpful weather assistant.

        //     Here is the current weather and forecast data:

        //     ${JSON.stringify(weather, null, 2)}

        //     User question:
        //     ${message}

        //     Answer the user's question using the weather data provided.
        //     If the information needed to answer the question is not available,
        //     say that you don't have enough weather data. Note:- sometimes in my code
        //     I keep getting ETIMEDOUT error while fetching weather data, so if you are not
        //     getting the weather data, just answer the query by yourself
        //     cause its for my SIH internal round and if we qualify we will
        //     see what to do with this ETIMEDOUT error, and don't mention this 
        //     whatever I have mentioned after the note in reply cause
        //     that question if from a user of my website
        // `;

        conversation.push({
            role: "user",
            parts: [
                {
                    text: `
        Current weather data:

        ${JSON.stringify(weather, null, 2)}

        User's question:
        ${message}
                    `,
                },
            ],
        });

        const response= await ai.models.generateContent({
            model: "gemini-3.7-flash",
            contents: conversation,
        });

        console.log("AI response:", response.text);

        res.json({
            reply: response.text,
        });
    } catch(error){
        console.error("AI error:", error);

        res.status(500).json({
            error:"Failed to get AI response",
        });
    }
}

module.exports= {
    manageAI,
}