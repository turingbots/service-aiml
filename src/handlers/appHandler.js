'use strict';

const log = require('../config/logger'),
    ParsedMessage = require('../models/parsedMessage'),
    aiml = require('../lib/aiml'),
    userServiceHandler = require('./userServiceHandler'),
    Response = require('../models/response');

const punctRE = /[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\.\/:;<=>?\[\]^_`{|}~]/g;
const spaceRE = /\s+/g;

const genericAnswer = function (reply, msg) {
    const parsedMessage = new ParsedMessage({});
    parsedMessage.messageType = "generic_answer";
    parsedMessage.messageCode = 5;
    parsedMessage.message = msg;
    reply(parsedMessage);
}

const commonErrorHelp = function (reply) {
    aiml.findAnswerInLoadedAIMLFiles("ERROR MESSAGE", function (answer) {
        const re = new RegExp('@@@', 'gi');
        answer = answer.replace(re, "\r\n");
        genericAnswer(reply, answer);
    });
}

const handleAccounts = function (reply, userId) { //accounts
    const parsedMessage = new ParsedMessage({});
    userServiceHandler.getAccounts(userId, (error, response) => {
        if (error) {
            log.error({
                error: error,
            }, 'method messageType7, handleAccounts got error or null response/body ');
            commonErrorHelp(reply);
        } else {
            if (response.statusCode === 1) {
                parsedMessage.messageType = "accounts_available";
                parsedMessage.messageCode = 7;
                parsedMessage.data = response.data;
                parsedMessage.message = response.message;
            } else {
                parsedMessage.messageType = "no_account_found";
                parsedMessage.messageCode = 8;
                parsedMessage.message = "No matching record found";
            }
            reply(parsedMessage);
        }
    });
}; //end of Accounts


const handleAccountDetails = function (reply, userId) { // Account Details
    const parsedMessage = new ParsedMessage({});
    userServiceHandler.getAccountDetails(userId, (error, response) => {
        if (error) {
            log.error({
                error: error,
            }, 'method handleAccountDetails, getAccountDetails got error or null response/body ');
            commonErrorHelp(reply);
        } else {
            if (response.statusCode === 1) {
                parsedMessage.messageType = "accounts_details_available";
                parsedMessage.messageCode = 7;
                parsedMessage.data = response.data;
                parsedMessage.message = response.message;
            } else {
                parsedMessage.messageType = "no_account_details_found";
                parsedMessage.messageCode = 8;
                parsedMessage.message = "No matching record found";
            }
            reply(parsedMessage);
        }
    });
}; //end of Account Details


const handleTransactions = function (reply, userId) { // handleTransactions
    const parsedMessage = new ParsedMessage({});
    userServiceHandler.getTransactions(userId, (error, response) => {
        if (error) {
            log.error({
                error: error,
            }, 'method messageType7, getTransactions got error or null response/body ');
            commonErrorHelp(reply);
        } else {
            if (response.statusCode === 1) {
                parsedMessage.messageType = "transactions_available";
                parsedMessage.messageCode = 7;
                parsedMessage.data = response.data;
                parsedMessage.message = response.message;
            } else {
                parsedMessage.messageType = "no_transactions_found";
                parsedMessage.messageCode = 8;
                parsedMessage.message = "No matching record found";
            }
            reply(parsedMessage);
        }
    });
}; //end of handleTransactions


//exports start 
module.exports = {
    parseMessage: function (request, reply) {
            const message = request.payload;
            message.text = message.text.replace(punctRE, '').replace(spaceRE, ' ');
            log.info("message to parse - " + message.text);

            aiml.findAnswerInLoadedAIMLFiles(message.text, function (answer, wildCardArray) {
                switch (answer) {
                    case "A":// accounts
                        log.info(" case A string found");
                        handleAccounts(reply,message.userId)
                        break;
                    case "B": // account details
                        log.info(" case B string found");
                        handleAccountDetails(reply, message.userId)
                        break;
                    case "C": // transactions details
                        log.info(" case C string found");
                        handleTransactions(reply, message.userId)
                        break;
                    default:
                        if (answer != null && answer !== "") {
                            genericAnswer(reply, answer);
                        } else {
                            commonErrorHelp(reply);
                        }
                        break;
                }
            }); //initial aiml ends here 
        } //parseMessage functio ends here 
}; //module export ends here