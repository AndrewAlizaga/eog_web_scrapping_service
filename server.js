//DB
let client = require("./services/db/redis/index");
const { error } = require("console");
client.connect()


//GRPC DEPENDENCIES
const PROTO_SEARCH_PATH = __dirname + '/proto/search.proto';
const {v4:uuidv4} = require("uuid")

const {searchCase} = require("./controllers/case")

const grpc = require("@grpc/grpc-js")
var protoLoader = require('@grpc/proto-loader');

var EOG_WEB_SCRAPPER_ADDR_PORT = process.env.EOG_WEB_SCRAPPER_ADDR_PORT


const options =  {keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true
 }

var packageDefinition = protoLoader.loadSync(PROTO_SEARCH_PATH, options);
const search = grpc.loadPackageDefinition(packageDefinition).search;

var server = new grpc.Server();

server.addService(search.SearchService.service, {
  PostSearch: PostSearch
});


server.bindAsync(
  EOG_WEB_SCRAPPER_ADDR_PORT.toString(),
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("GRPC Server running at http://127.0.0.1:50051");
    server.start();
  }
);


async function PostSearch (call, callback) {

  console.log('called post search grpc method')
  search_ = call.request
  console.log('req obj: '+search_)
  console.log(search_)
  console.log(search_.name)

   

  var searchCaseResponse = await searchCase(search_.name)

  var result = searchCaseResponse.scrappingResponse
  var err = searchCaseResponse.error

  console.log("AFTER CASE CALL")

  if (err != null) {


    //return res.status(503).json({'message': e.toString()})
    callback(err, result)

    //return null, new Error("INTERNAL ERROR: "+err.toString())
  }

  console.log('search results: ' + result)

  console.log(result)

  callback(null, result)
}













/*
const express = require("express")

//activate env var
require("dotenv").config()
const port = process.env.PORT || 8000

//Router
const router = require('./routes')
require('dotenv').config()

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
*/