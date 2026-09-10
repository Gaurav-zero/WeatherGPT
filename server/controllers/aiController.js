const OpenAI= require("openai");
const {GoogleGenAI} = require("@google/genai");

require("dotenv").config();

const openai= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const ai= new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateWithRetry(conversation, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents: conversation,
            });
        } catch (error) {
            if (error.status !== 503 || attempt === retries) {
                throw error;
            }

            console.log(`Gemini unavailable. Retrying (${attempt}/${retries})...`);

            await new Promise(resolve =>
                setTimeout(resolve, 1000 * attempt)
            );
        }
    }
}

async function manageAI(req,res){
    try{
        const {message,weather, messages,language,action}= req.body;

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

        if (action === "agriculture") {
            conversation.push({
                role: "user",
                parts: [
                    {
                        text: `
        You are WeatherGPT's agriculture assistant.

        Using the current weather data below, provide a brief and useful
        agriculture-related advisory for farmers.

        Mention relevant conditions such as:
        - temperature
        - rainfall
        - humidity
        - wind
        - any other weather factor relevant to farming

        Do not invent weather information that is not present in the data.

        After the advisory, ask the user what they would like to know
        about agriculture.

        Respond entirely in the selected language.

        Selected language: ${language}

        Current weather data:
        ${JSON.stringify(weather, null, 2)}
                        `,
                    },
                ],
            });
        }

        if(action !== "agriculture"){
        conversation.push({
            role: "user",
            parts: [
                {
                    text: `
        Respond to the user in ${language}.

        Current weather data:
        ${JSON.stringify(weather, null, 2)}

        User's question:
        ${message}
                    `,
                },
            ],
        });
    }

        const response = await generateWithRetry(conversation);

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