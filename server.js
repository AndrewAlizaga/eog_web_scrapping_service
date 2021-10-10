const express = require("express")

//activate env var
require("dotenv").config()
const port = process.env.PORT || 8000

const app = express()

//testing
app.get("/", (req, res) => {
    return res.status(200).json('I AM ALIVE')
})


//listen at port
app.listen(port, (req) => {
    console.log(`rocking and rolling at ${port}`)
})