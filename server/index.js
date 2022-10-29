const express = require("express")
const app = express();

app.get("/", (req, res) => {
    res.send("HEllo world")
})

app.listen(5000)