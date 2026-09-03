const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const express= require("express");
const cors= require("cors");
const indexRouter= require("./routes/indexRouter");


const app= express();

app.use(cors());

app.use("/", indexRouter);

const PORT= process.env.PORT || 3000;

app.listen(PORT, (err) =>{
    if(err){
        throw err;
    }

    console.log(`Server running on port ${PORT}`)
});