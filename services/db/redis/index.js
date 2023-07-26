const { createClient } = require("redis")




const client = createClient({
    password: process.env.EOG_REDIS_PASS,
    socket: {
        host: process.env.EOG_REDIS_HOST,
        port: process.env.EOG_REDIS_PORT,
        timeout: 60,
    }
});


client.on('connect', function () {
  console.log("REDIS connected")
});

client.on("error", (err) => {
  console.log('there was an error :( accesing redis server using')
  console.log(err);
});

client.connect()

module.exports = client
