const {MongoClient, ServerApiVersion} = require("mongodb");

const connUrl = process.env.EOG_MONGO_CONN

const mongoClient = new MongoClient(connUrl, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})

async function initMongoClient() {
    console.log("initing mongodb")

    try {

        await mongoClient.connect()

        await client.db("admin").command({ping: 1})
        console.log("ping success")
    } finally {
        await client.close();
        console.log("client close on error")
    }
}

initMongoClient()

module.exports = {mongoClient}