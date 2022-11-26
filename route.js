const { sampleHandler } = require('./helper/routeHandler/sampleHandler');
const { tokenHandler } = require('./helper/routeHandler/tokenHandler');
const { userHandler } = require('./helper/routeHandler/userHandler');
const { checkHandler } = require('./helper/routeHandler/checkHandler');

const routes = {
    '/sample': sampleHandler,
    '/user': userHandler,
    '/token': tokenHandler,
    '/check': checkHandler,
};

module.exports = routes;
