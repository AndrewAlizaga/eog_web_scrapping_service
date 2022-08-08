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

var EOG_WEB_SCRAPPER_ADDR = process.env.EOG_WEB_SCRAPPER_ADDR

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

var syncAddres = EOG_WEB_SCRAPPER_ADDR.toString()+`:${process.env.PORT || 8080}`;
server.bindAsync(
  syncAddres,
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("GRPC Server running at "+syncAddres);
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
