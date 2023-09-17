import { SendMessageRequest, ReceiveMessageRequest, DeleteMessageRequest } from 'aws-sdk/clients/sqs';
import { sqs } from '../config/awsConfig';

export const sendMessage = async (queueUrl: string, messageBody: string): Promise<void> => {
  const params: SendMessageRequest = {
    QueueUrl: queueUrl,
    MessageBody: messageBody,
  };

  await sqs.sendMessage(params).promise();
};

export const receiveMessages = async (queueUrl: string, maxMessages: number): Promise<any[]> => {
  const params: ReceiveMessageRequest = {
    QueueUrl: queueUrl,
    MaxNumberOfMessages: maxMessages,
  };

  const response = await sqs.receiveMessage(params).promise();
  return response.Messages || [];
};

export const deleteMessage = async (queueUrl: string, receiptHandle: string): Promise<void> => {
  const params: DeleteMessageRequest = {
    QueueUrl: queueUrl,
    ReceiptHandle: receiptHandle,
  };

  await sqs.deleteMessage(params).promise();
};
