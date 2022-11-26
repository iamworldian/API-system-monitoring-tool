const hash = require('crypto');
const ENV = require('./environment');

const utilities = {};
utilities.parseJSON = (jsonString) => {
    let output = {};

    try {
        output = JSON.parse(jsonString);
    } catch (err) {
        console.log(`${err}error on parsing`);
    }

    return output;
};
utilities.hashing = (str) => hash.createHmac('sha256', ENV.secretkey).update(str).digest('hex');

utilities.randomStringGen = (len) => {
    const possibleCharacters =        'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@$%%^*_';

    let ret = '';

    for (let i = 0; i < len; i += 1) {
        ret += possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)];
    }
    return ret;
};

module.exports = utilities;
