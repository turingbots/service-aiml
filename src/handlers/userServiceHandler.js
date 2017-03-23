'use strict';

const log = require('../config/logger'),
    request = require('request'),
    settings = require('../config/settings');

const userServiceHandler = {

  getUserAccounts: function (userId, cb) {
        request({
            url: settings.userService + '/' + userId + "/accounts",
            method: 'GET'

        }, function (error, response, body) {
            if (error) {
                log.error({
                    error: error
                }, "Get user accounts by user id  service failed ");
                cb(error, null);
            } else if (response.statusCode === 200) { //valid json body 
                log.info("Get user accounts by user id service successful");
                cb(null, JSON.parse(body));
            } else { //non 200 status
                log.error({
                    error: response
                }, "Get user accounts by user id service successful but unexpected statusCode  ");
                cb(response, null);
            };
        });
    },

    getTransactions: function (userId, cb) {
        request({
            url: settings.userService + '/' + userId + "/transactions",
            method: 'GET'

        }, function (error, response, body) {
            if (error) {
                log.error({
                    error: error
                }, "Get transactions by user id  service failed ");
                cb(error, null);
            } else if (response.statusCode === 200) { //valid json body 
                log.info("Get transactions by user id service successful");
                cb(null, JSON.parse(body));
            } else { //non 200 status
                log.error({
                    error: response
                }, "Get transactions by user id service successful but unexpected statusCode  ");
                cb(response, null);
            };
        });
    },

    
}
module.exports = userServiceHandler;