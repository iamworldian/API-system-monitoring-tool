
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    callback(200, {
        message: 'This is from /sample route',
    });
};

module.exports = handler;
