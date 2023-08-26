"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enqueueSellRequest = void 0;
// workers/sellWorker.ts
const AwsQueuingService_1 = require("../messaging/AwsQueuingService");
const enqueueSellRequest = async (sellRequestData, queueUrl) => {
    try {
        const messageBody = JSON.stringify(sellRequestData);
        // Send the message to the SQS queue
        await (0, AwsQueuingService_1.sendMessage)(queueUrl, messageBody);
        console.log(`Sell request enqueued: ${messageBody}`);
    }
    catch (error) {
        console.error('Error enqueueing sell request:', error);
        throw error;
    }
};
exports.enqueueSellRequest = enqueueSellRequest;
// Call the enqueueSellRequest function here or export it for external use
