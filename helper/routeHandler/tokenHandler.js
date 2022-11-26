const crud = require('../../lib/data');
const { hashing, parseJSON, randomStringGen } = require('../utilities');

const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'put', 'delete', 'post'];

    if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
        handler.token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405, {
            message: 'The Mehtod is not available',
        });
    }
};

handler.token = {};

handler.token.post = (requestProperties, callback) => {
    const user = handler.check.validation(requestProperties.body);

    const { phone, password } = user;

    if (phone && password) {
        crud.read('users', `${phone}.json`, (errOnReadin, data) => {
            const retrievedUser = parseJSON(data);

            if (retrievedUser.password === hashing(password)) {
                const tokenId = randomStringGen(25);
                const tokenObj = {
                    phone,
                    tokenId,
                    expires: Date.now() + 60 * 60 * 1000,
                };
                crud.create(
                    'tokens',
                    `${tokenId}.json`,
                    JSON.stringify(tokenObj),
                    (errOnCreating) => {
                        if (!errOnCreating) {
                            callback(202, {
                                message: 'Token Creation Succesfull',
                            });
                        } else {
                            callback(404, {
                                message:
                                    'Problem on creating token file or the toke might exist already',
                            });
                        }
                    }
                );
            } else {
                callback(404, {
                    message: 'Wrong Password',
                });
            }
        });
    } else {
        callback(404, {
            message: 'Phone and password must be valid',
        });
    }
};

handler.token.get = (requestProperties, callback) => {
    const { token } = requestProperties.queryString;

    crud.read('tokens', `${token}.json`, (errOnRead, data) => {
        if (!errOnRead) {
            callback(200, parseJSON(data));
        } else {
            callback(404, errOnRead);
        }
    });
};

handler.token.delete = (requestProperties, callback) => {
    const { token } = requestProperties.queryString;

    if (token) {
        crud.delete('tokens', `${token}.json`, (errOnDelete) => {
            if (!errOnDelete) {
                callback(200, {
                    message: 'Token deleted successfully',
                });
            } else {
                callback(404, {
                    message: 'Token not found',
                });
            }
        });
    }
};

handler.token.put = (requestProperties, callback) => {
    const { tokenId } = requestProperties.body;
    console.log(requestProperties.body);
    if (tokenId) {
        crud.read('tokens', `${tokenId}.json`, (errOnReading, data) => {
            const tokenObject = parseJSON(data);
            tokenObject.expires = Date.now() + 60 * 60 * 1000;

            crud.update('tokens', `${tokenId}.json`, JSON.stringify(tokenObject), (errOnUpdate) => {
                if (!errOnUpdate) {
                    callback(200, {
                        message: 'Token Update successful',
                    });
                } else {
                    callback(400, {
                        message: 'Token update failed',
                    });
                }
            });
        });
    } else {
        callback(404, {
            message: 'Token not found',
        });
    }
};

handler.check = {};
handler.check.tokenValidation = (token, phone, callback) => {
    crud.read('tokens', `${token}.json`, (errOnreading, tokenObj) => {
        if (!errOnreading) {
            const tokenPhone = parseJSON(tokenObj).phone;
            if (tokenPhone === phone) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};
handler.check.validation = (body) => {
    const firstName =
        typeof body.firstName === 'string' && body.firstName.trim().length > 0
            ? body.firstName
            : false;

    const lastName =
        typeof body.firstName === 'string' && body.firstName.trim().length > 0
            ? body.lastName
            : false;
    const phone =        typeof body.phone === 'string' && body.phone.trim().length === 11 ? body.phone : false;

    const agreement = typeof body.agreement === 'boolean' ? body.agreement : false;

    const password =        typeof body.password === 'string' && body.password.trim().length > 0
            ? body.password
            : false;

    return {
        firstName,
        lastName,
        phone,
        agreement,
        password,
    };
};

module.exports = handler;
