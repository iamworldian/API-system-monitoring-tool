const environment = {};

environment.staging = {
    port: 3000,
    name: 'Staging',
    secretkey: 'thisisasecretkey',
    twilio: {
        from: '+19498285495',
        accountSid: 'AC91f099178632a87219da02a7cacd616e',
        authToken: '6c2f07426ababc622eb51cf30e844897',
    },
};

environment.production = {
    port: 5000,
    name: 'Production',
    secretkey: 'thisisasecretkey',
};
const environmentName = typeof process.env.DEV_ENV === 'string' ? process.env.DEV_ENV : 'staging';

// eslint-disable-next-line prettier/prettier, no-trailing-spaces, operator-linebreak
const environmentObjectToExport = 
    typeof environment[environmentName] === 'object'
        ? environment[environmentName]
        : environment.staging;

module.exports = environmentObjectToExport;
