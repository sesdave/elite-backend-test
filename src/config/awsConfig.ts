// awsConfig.ts
import { SQS } from 'aws-sdk';

// Configure your AWS credentials and region
const awsConfig = {
  region: process.env.region || 'us-west-2',
  accessKeyId: process.env.accessKeyId || 'AKIAU3UQIOJTZ2QOQ3YO',
  secretAccessKey: process.env.secretAccessKey || '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',
};

// Create an instance of the SQS service
const sqs = new SQS(awsConfig);

export { sqs };
