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
        await mongoClient.db("admin").command({ping: 1})

        console.log("ping success")
    } catch (error) {
        console.log(error)
        await mongoClient.close();
    }
}

initMongoClient()

module.exports = mongoClient