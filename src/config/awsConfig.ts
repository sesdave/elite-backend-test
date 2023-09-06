// awsConfig.ts
import { SQS } from 'aws-sdk';

// Configure your AWS credentials and region
const awsConfig = {
  region: process.env.region || 'us-west-2',
  accessKeyId: process.env.accessKeyId || '',
  secretAccessKey: process.env.secretAccessKey || '',
};

// Create an instance of the SQS service
const sqs = new SQS(awsConfig);

export { sqs };
