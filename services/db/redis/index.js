const redis = require("redis");
const { promisify } =  require("util");

let client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS,
});

function init(){
  client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS,
  });
}


client.on('connect', function() {
  console.log('Connected!');
});

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {getAsync, setAsync, init}
