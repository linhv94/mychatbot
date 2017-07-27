'use strict';

const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

const app = express();
app.set('port', process.env.PORT || 5000);
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//index page
app.get('/', function(req, res) {
	res.send('Hi! This is my chatbot.');
});


//Verification
app.get("/webhook", function (req, res) {
  if (req.query["hub.verify_token"] === "this_is_my_token") {
    console.log("Verified webhook");
    res.status(200).send(req.query["hub.challenge"]);}
	else {
		res.send('Invalid token.');
		res.sendStatus(403);
	}
});

var greetings = new Array("hello", "hi", "good morning", "hey");

app.post('/webhook/', function(req, res){
	let messaging_events = req.body.entry[0].messaging
	for (let i = 0; i < messaging_events.length; i++){
		let event = messaging_events[i];
		let sender = event.sender.id;
		if(event.message && event.message.text){
			let text = event.message.text;
			for(let z = 0; z < greetings.length; z++){
				if(text === greetings[z]){
					sendText(sender, text);
					break;
					}
				}
			}
		}
	res.sendStatus(200);
});

function sendText(sender, text){
	const messageData = {text : "Hello. Can I help you?"};
	request({
		url: 'https://graph.facebook.com/v2.6/me/messages',
		qs : {access_token:  process.env.FB_ACCESS_TOKEN},
		method: "POST",
		json: {
			recipient: {id: sender},
			message : messageData,
		}, function(error, response, body){
			if(error){
				console.log("sending error");
			} else if (response.body.error){
				console.log("response body error");
			}
		}
	});
};

app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});
