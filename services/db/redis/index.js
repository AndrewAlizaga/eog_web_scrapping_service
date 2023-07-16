const redis = require("redis");

const client = redis.createClient({url: process.env.EOG_REDIS_CLOUD_URL} );

console.log('redis defined')

client.on('connect', function () {
  console.log("connected")
});

client.on("error", (err) => {
  console.log('there was an error :( accesing redis server using')
  console.log(err);
});


module.exports = client
