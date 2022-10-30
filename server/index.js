const express = require('express'); 
const cors = require('cors');
const twilio = require('twilio'); 

//twilio requirements -- Texting API 
const accountSid = 'AC8bb324884f6fe399ceecffae6a6c9b55';
const authToken = '6202100c01988c8da6bfb6bd4a8b3bf6'; 
const client = new twilio(accountSid, authToken);

function twilioclien() {
    try {
        client.messages.create({
            body: "TEsTing agaIn",
            to: '+917506086787',  // Text this number
            from: '+19897560563' // From a valid Twilio number
        }).then((message) => console.log(message.body))
    } catch(err) {
        console.log(err)
    }
}

twilioclien()
