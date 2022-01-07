const express = require("express")

//activate env var
require("dotenv").config()
const port = process.env.PORT || 8000

//Router
const router = require('./routes')

require("./services/db/redis/index").init()

const app = express()

app.use('/api', router)

//testing
app.get("/", (req, res) => {
    return res.status(200).json('I AM ALIVE')
})


//listen at port
app.listen(port, (req) => {
    console.log(`rocking and rolling at ${port}`)
})
