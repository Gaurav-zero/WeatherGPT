const {Router}= require("express");
const weatherController= require("../controllers/weatherController");


const indexRouter= Router();

indexRouter.get("/", (req, res) =>{
    res.send("WeatherGPT backend is running !");
});

indexRouter.get("/api/weather", weatherController.getWeatherInfo);


module.exports= indexRouter;