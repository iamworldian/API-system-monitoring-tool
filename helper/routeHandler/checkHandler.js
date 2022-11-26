
const crud = require('../../lib/data');
const {parseJSON, randomStringGen } = require('../utilities');
const tokenHandler = require('./tokenHandler');

const handler = {};

handler.checkHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'put', 'delete', 'post'];
    if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
        handler.check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'The Mehtod is not available',
        });
    }
};

handler.check = {};

handler.check.post = (requestProperties, callback) => {
    const { protocol, url, method, successCodes, timeOutSeconds } = requestProperties.body;

    if (protocol && url && method && successCodes && timeOutSeconds) {
        const { token } = requestProperties.headerObject;

        crud.read('tokens', `${token}.json`, (errOnReadToken, tokenData) => {
            const { phone } = parseJSON(tokenData);
            crud.read('users', `${phone}.json`, (errOnReadUser, userData) => {
                if (!errOnReadUser && userData) {
                    tokenHandler.check.tokenValidation(token, phone, (verification) => {
                        if (verification) {
                            const userObject = JSON.parse(userData);
                            const checkObject = {
                                checkId: randomStringGen(20),
                                phone,
                                protocol,
                                url,
                                method,
                                successCodes,
                                timeOutSeconds,
                            };

                            userObject.checks =
                                typeof userObject.checks === 'object'
                                && userObject.checks instanceof Array
                                    ? userObject.checks
                                    : [];

                            userObject.checks.push(checkObject);
                            crud.create(
                                'checks',
                                `${checkObject.checkId}.json`,
                                JSON.stringify(checkObject),
                                (errOnCreatingChecks) => {
                                    if (!errOnCreatingChecks) {
                                        crud.update(
                                            'users',
                                            `${phone}.json`,
                                            JSON.stringify(userObject),
                                            (errOnUpdateUser) => {
                                                if (!errOnUpdateUser) {
                                                    callback(200, {
                                                        message:
                                                            'Successfully updated user and check',
                                                    });
                                                } else {
                                                    callback(404, {
                                                        error: 'Error on updating user',
                                                    });
                                                }
                                            },
                                        );
                                    } else {
                                        callback(404, {
                                            error: 'Error on updating User',
                                        });
                                    }
                                }
                            );
                        } else {
                            callback(400, {
                                error: 'Problem with verifying user token',
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'User not found',
                    });
                }
            });
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler.check.get = (requestProperties, callback) => {
    const { checkId } = requestProperties.queryString;
    const { token } = requestProperties.headerObject;
    console.log(checkId, token);
    if (checkId) {
        crud.read('checks', `${checkId}.json`, (errOnReadingToken, checkObject) => {
            if (!errOnReadingToken) {
                tokenHandler.check.tokenValidation(
                    token,
                    parseJSON(checkObject).phone,
                    (verification) => {
                        if (verification) {
                            callback(200, parseJSON(checkObject));
                        } else {
                            callback(400, {
                                error: 'Token and phone not matched',
                            });
                        }
                    }
                );
            } else {
                callback(400, {
                    error: `${errOnReadingToken}Check id not found`,
                });
            }
        });
    } else {
        callback(400, {
            error: 'check id must be vaild',
        });
    }
};

handler.check.delete = (requestProperties, callback) => {};

handler.check.put = (requestProperties, callback) => {};

module.exports = handler;
