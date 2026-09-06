const {Router}= require("express");
const weatherController= require("../controllers/weatherController");
const aiController= require("../controllers/aiController");


const indexRouter= Router();

indexRouter.get("/", (req, res) =>{
    res.send("WeatherGPT backend is running !");
});

indexRouter.get("/api/weather", weatherController.getWeatherInfo);
indexRouter.get("/api/location/search", weatherController.searchLocation);
indexRouter.post("/api/chat", aiController.manageAI);


module.exports= indexRouter;