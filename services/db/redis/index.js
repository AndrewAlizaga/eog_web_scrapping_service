const redis = require("redis");
const { promisify } =  require("util");


  console.log('redis init')
  console.log('keys')
  console.log(process.env.REDIS_HOST)

  console.log(process.env.REDIS_PASS)

  console.log(process.env.REDIS_PORT)

 const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS,
  });

console.log('redis defined')

client.on('connect', function() {
  console.log('Redis Connected!');
});

client.on("error", (err) => {
  console.log(err);
});
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

module.exports = {getAsync, setAsync, client}
