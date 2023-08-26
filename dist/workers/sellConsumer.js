"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AwsQueuingService_1 = require("../messaging/AwsQueuingService");
const itemService_1 = require("../services/itemService");
const processSellRequests = async (queueUrl) => {
    try {
        console.log("Waiting for Messages!!");
        const maxMessages = 10;
        const messages = await (0, AwsQueuingService_1.receiveMessages)(queueUrl, maxMessages);
        for (const message of messages) {
            const { item, quantity } = JSON.parse(message.Body);
            console.log(`Received Message ${item} - ${quantity}`);
            // Call the sellItem function or your desired logic
            await (0, itemService_1.sellItem)(item, quantity);
            // Delete the processed message from the queue
            await (0, AwsQueuingService_1.deleteMessage)(queueUrl, message.ReceiptHandle);
        }
    }
    catch (error) {
        console.error('Error processing sell requests:', error);
        throw error;
    }
    finally {
        processSellRequests(process.env.queueUrl || 'https://sqs.us-west-2.amazonaws.com/334236250727/elite-dev');
    }
};
processSellRequests(process.env.queueUrl || 'https://sqs.us-west-2.amazonaws.com/334236250727/elite-dev');
