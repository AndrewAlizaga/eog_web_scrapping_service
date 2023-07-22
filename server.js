//DB
let client = require("./services/db/redis/index");
require("./services/db/mongo/mongo")
client.connect()

//HTTP DEPENDENCIES
const express = require("express")
const app = express()
const router = require('./routes')



//GRPC DEPENDENCIES
const PROTO_SEARCH_PATH = __dirname + '/proto/search.proto';
const {v4:uuidv4} = require("uuid")
const {searchCase} = require("./controllers/case")

const grpc = require("@grpc/grpc-js")
var protoLoader = require('@grpc/proto-loader');

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


async function startHttp(){
  
  app.use(express.json())

  app.use('/api', router)
  
  //testing
  app.get("/", (req, res) => {
    //  client.set('initer', 123)
  
      return res.status(200).json('I AM ALIVE')
  })
  
  
  //listen at port
  var httpPort = process.env.PORT || 8080
  app.listen(httpPort, (req) => {
      console.log(`HTTP Server rocking and rolling at ${httpPort}`)
  })

}

async function startGrpc(){

  var EOG_WEB_SCRAPPER_ADDR = process.env.EOG_WEB_SCRAPPER_ADDR || '127.0.0.1'

  var syncAddres = EOG_WEB_SCRAPPER_ADDR.toString()+`:${process.env.EOG_ENGINE_GRPC_PORT || 50051}`;
  server.bindAsync(
    syncAddres,
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log("GRPC Service running at "+syncAddres);
      server.start();
    }
  );
}


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



startGrpc()
startHttp()