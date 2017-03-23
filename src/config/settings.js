'use strict';

const getUserService = function () {
    if (process.env.NODE_ENV === 'PRODUCTION') {
        return `https://service-citi-api.cfapps.io/v1/user`;
        // https://service-citi-api.cfapps.io/v1/user/994195690708817/accounts
    } else {
        // return `http://localhost:3001/v1/user`;
        return `https://service-citi-api.cfapps.io/v1/user`;
    }
}

const settings = {
    userService: getUserService(),
    port: process.env.PORT || '3002'
}

module.exports = settings;