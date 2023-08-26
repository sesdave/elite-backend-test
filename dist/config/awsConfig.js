"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqs = void 0;
// awsConfig.ts
const aws_sdk_1 = require("aws-sdk");
// Configure your AWS credentials and region
const awsConfig = {
    region: process.env.region || 'us-west-2',
    accessKeyId: process.env.accessKeyId || 'AKIAU3UQIOJTZ2QOQ3YO',
    secretAccessKey: process.env.secretAccessKey || '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',
};
// Create an instance of the SQS service
const sqs = new aws_sdk_1.SQS(awsConfig);
exports.sqs = sqs;
