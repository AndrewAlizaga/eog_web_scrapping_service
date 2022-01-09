const redis = require("redis");

 const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || 6379),
  });

console.log('redis defined')


client.on('connect', function() {
  console.log('Redis Connected!');
});

client.on("error", (err) => {
  console.log(err);
});

client.on('ready', () => {
  console.log('Client connected, ready to go!')
})


client.on('end', ()=>{
  console.log('Client disconnected')
})


process.on('SIGINT', ()=> {
  client.quit()
})

module.exports = client
