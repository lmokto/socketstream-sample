var redis = require("redis"),
	client1 = redis.createClient();

client1.subscribe("9016")
client1.subscribe("9015")
client1.subscribe("9014")


client1.on('message', function(channel, message){
	console.log(channel)
	console.log(message)
});