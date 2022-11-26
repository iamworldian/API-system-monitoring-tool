const accountSid = 'AC91f099178632a87219da02a7cacd616e'; // Your Account SID from www.twilio.com/console
const authToken = '6c2f07426ababc622eb51cf30e844897'; // Your Auth Token from www.twilio.com/console

const twilio = require('twilio');

const notificaions = {};

notificaions.trigger = (phone, msg) => {
    const client = new twilio(accountSid, authToken);
    console.log(phone, msg);
    client.messages
        .create({
            body: msg,
            to: `+88${phone}`, // Text this number
            from: '+19498285495', // From a valid Twilio number
        })
        .then((message) => console.log(message.sid));
};

module.exports = notificaions;
