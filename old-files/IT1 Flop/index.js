var express = require('express');

/* Start */
const app = express();
const path = require("path");
app.use(express.static(__dirname + "/public"));

/* Routes */
app.get("/",(req,res)=>{
    console.log("GET /")
    // process - find all foods from mongoose

    res.sendFile(path.join(__dirname, "index.html"));
})

/* Listen */
app.listen(3000);