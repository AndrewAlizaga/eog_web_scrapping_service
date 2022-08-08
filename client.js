//GRPC DEPENDENCIES
const searchModel = require("./proto/search")
const PROTO_SEARCH_PATH = './proto/search.proto';

const grpc = require("@grpc/grpc-js")
var protoLoader = require('@grpc/proto-loader');

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_SEARCH_PATH, options);
const SearchService = grpc.loadPackageDefinition(packageDefinition).SearchService;

const client = new SearchService(
  process.env.EOG_WEB_SCRAPPER_ADDR_PORT,
  grpc.credentials.createInsecure()
);


client.PostSearch({
  id: 1,
  name:  "jose gutierrez",
  leads: []
}, (err, data) => {

  console.log("post search client method")
  if(err != null){
    console.log(err)
    throw err
  } 
  console.log(data)
})