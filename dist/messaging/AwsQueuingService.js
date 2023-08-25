"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMessage = exports.receiveMessages = exports.sendMessage = void 0;
const awsConfig_1 = require("../config/awsConfig");
const sendMessage = async (queueUrl, messageBody) => {
    const params = {
        QueueUrl: queueUrl,
        MessageBody: messageBody,
    };
    await awsConfig_1.sqs.sendMessage(params).promise();
};
exports.sendMessage = sendMessage;
const receiveMessages = async (queueUrl, maxMessages) => {
    const params = {
        QueueUrl: queueUrl,
        MaxNumberOfMessages: maxMessages,
    };
    const response = await awsConfig_1.sqs.receiveMessage(params).promise();
    return response.Messages || [];
};
exports.receiveMessages = receiveMessages;
const deleteMessage = async (queueUrl, receiptHandle) => {
    const params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receiptHandle,
    };
    await awsConfig_1.sqs.deleteMessage(params).promise();
};
exports.deleteMessage = deleteMessage;
