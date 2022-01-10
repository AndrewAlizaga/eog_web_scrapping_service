const express = require("express")

//activate env var
require("dotenv").config()
const port = process.env.PORT || 8000

//Router
const router = require('./routes')
require('dotenv').config()
let client = require("./services/db/redis/index")
client.connect()
//client.connect()
client.set('special', 123)

const app = express()
//app.redisClient = client

app.use(express.json())

app.use('/api', router)

//testing
app.get("/", (req, res) => {
  //  client.set('initer', 123)

    return res.status(200).json('I AM ALIVE')
})


//listen at port
app.listen(port, (req) => {
    console.log(`rocking and rolling at ${port}`)
})
