const crud = require('../../lib/data');
const { hashing, parseJSON } = require('../utilities');
const tokenHandler = require('./tokenHandler');

const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptedMethods = ['get', 'put', 'delete', 'post'];

    if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
        if (requestProperties.method === 'get') {
            handler.user[requestProperties.method](requestProperties, callback);
        } else {
            const { phone } = requestProperties.body;
            const { token } = requestProperties.headerObject;

            tokenHandler.check.tokenValidation(token, phone, (verification) => {
                if (verification) {
                    handler.user[requestProperties.method](requestProperties, callback);
                } else {
                    callback(405, {
                        message: 'Token is not found',
                    });
                }
            });
        }
    } else {
        callback(405, {
            message: 'The Mehtod is not available',
        });
    }
};

handler.user = {};

handler.user.get = (requestProperties, callback) => {
    const user = requestProperties.queryString;

    crud.read('users', `${user.phone}.json`, (errOnReading, data) => {
        if (!errOnReading && data) {
            const userTemp = JSON.parse(data);
            delete userTemp.password;
            callback(200, userTemp);
        } else {
            callback(404, {
                message: 'User not found.Reading error',
            });
        }
    });
};

handler.user.post = (requestProperties, callback) => {
    const {
 firstName, lastName, phone, agreement, password 
} = handler.check.validation(
        requestProperties.body,
    );

    if (firstName && lastName && phone && agreement && password) {
        crud.create(
            'users',
            `${phone}.json`,
            JSON.stringify({
                firstName,
                lastName,
                phone,
                agreement,
                password: hashing(password),
            }),
            (errOnCreate) => {
                if (errOnCreate) {
                    callback(500, {
                        message: 'File exist exception',
                    });
                } else {
                    callback(200, {
                        message: 'Posted Succesffuly',
                    });
                }
            }
        );
    } else {
        callback(400, {
            error: 'Error in posting data.User Data is Corrupted',
        });
    }
};

handler.user.delete = (requestProperties, callback) => {
    const phone = typeof requestProperties.queryString.phone === 'string' &&
    requestProperties.queryString.phone.length === 11 ? requestProperties.queryString.phone : false;
    console.log(requestProperties.queryString.phone, phone);
    if (phone) {
        crud.delete('users', `${phone}.json`, (errOnDeleting) => {
            if (!errOnDeleting) {
                callback(200, {
                    message: 'Succesfully deleted',
                });
            } else {
                callback(400, {
                    message: "Failed to delete file.File Doesn't exist",
                });
            }
        });
    } else {
        callback(404, {
            message: 'you need to provide a unique identifier',
        });
    }
};

handler.user.put = (requestProperties, callback) => {
    const user = handler.check.validation(requestProperties.body);

    if (user.phone) {
        crud.read('users', `${user.phone}.json`, (errOnreading, data) => {
            if (!errOnreading && data) {
                const currentUser = parseJSON(data.toString());
                // console.log(currentUser);

                for (const key of Object.keys(currentUser)) {
                    if (user[key]) {
                        currentUser[key] = user[key];
                    }
                }
                // console.log(currentUser);
                if (user.password) {
                    currentUser.password = hashing(currentUser.password);
                }

                crud.update(
                    'users',
                    `${user.phone}.json`,
                    JSON.stringify(currentUser),
                    (errOnUpdating) => {
                        if (errOnUpdating) {
                            callback(405, {
                                message: 'User upate failed',
                            });
                        } else {
                            callback(200, {
                                message: 'User Updated Successfully',
                            });
                        }
                    },
                );
            }
        });
    } else {
        callback(404, {
            message: 'Invalid request, Unique id must Exist',
        });
    }
};

handler.check = {};

handler.check.validation = (body) => {
    const firstName =        typeof body.firstName === 'string' && body.firstName.trim().length > 0
            ? body.firstName
            : false;

    const lastName =        typeof body.firstName === 'string' && body.firstName.trim().length > 0
            ? body.lastName
            : false;
    const phone =
        typeof body.phone === 'string' && body.phone.trim().length === 11 ? body.phone : false;

    const agreement = typeof body.agreement === 'boolean' ? body.agreement : false;

    const password =
        typeof body.password === 'string' && body.password.trim().length > 0
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
