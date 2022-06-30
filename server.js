//GRPC DEPENDENCIES
const PROTO_ACCOUNT = require("./proto/account.js");
const PROTO_SEARCH = require("./proto/search.js");
const PROTO_SEARCH_PATH = './proto/search.proto';

const {searchCase} = require("./controllers/case")

const grpc = require("@grpc/grpc-js")
const grpcReflection = require("grpc-reflection-js")
var protoLoader = require('@grpc/proto-loader');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_SEARCH_PATH, options);
const searchProto = grpc.loadPackageDefinition(packageDefinition);




var server = new grpc.Server();

function PostSearch (call, callback) {

  let search = PROTO_SEARCH.Search
  search_ = call.request
  searchCase()
  callback(null, call.request)
}

server.addService(searchProto.SearchService.service, {
  PostSearch: PostSearch
});


server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);










/*
const express = require("express")

//activate env var
require("dotenv").config()
const port = process.env.PORT || 8000

//Router
const router = require('./routes')
require('dotenv').config()
let client = require("./services/db/redis/index");
const { error } = require("console");
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
*/