const express = require("express")
const app = express();
const config = require("./db/config");
const { default: mongoose } = require("mongoose");
const morgan = require("morgan");
const routes = require("./routes/index");


app.use(express.json())
app.use(express.urlencoded({extended: false}));
app.use(morgan('dev'));


//Handling uncaught exception
process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to uncaught Exception');
    process.exit(1);
})

mongoose.connect(config.DB).then(()=>{
    console.log("Mongodb connected...!!!")
}).catch(()=>{
    console.log("Database disconnected...")
})

app.use("/api", routes)




app.listen(config.PORT, ()=>{  console.log('server listening on port '+ config.PORT); })

