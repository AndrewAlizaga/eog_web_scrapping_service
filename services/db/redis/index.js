const redis = require("redis");

const client = redis.createClient({url: 'redis://'+process.env.REDISCLOUD_URL} );

console.log('redis defined')

client.on('connect', function () {
  console.log("connected")
});

client.on("error", (err) => {
  console.log('there was an error :( accesing redis server using')
  console.log(err);
});


module.exports = client
