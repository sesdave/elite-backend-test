import { receiveMessages, deleteMessage } from '../messaging/AwsQueuingService';
import { sellItem } from '../services/itemService';

const processSellRequests = async (queueUrl: string) => {
  try {
    const maxMessages = 10;
    const waitTimeSeconds = 20; // Set the desired wait time

    const messages = await receiveMessages(queueUrl, maxMessages);

    for (const message of messages) {
      const { item, quantity } = JSON.parse(message.Body);
      console.log(`Received Message ${item} - ${quantity}`)

      // Call the sellItem function or your desired logic
      await sellItem(item, quantity);

      // Delete the processed message from the queue
      await deleteMessage(queueUrl, message.ReceiptHandle);
    }
  } catch (error) {
    console.error('Error processing sell requests:', error);
    throw error;
  } finally {
    processSellRequests(queueUrl); // Keep long-polling
  }
};

processSellRequests(process.env.queueUrl || 'https://sqs.us-west-2.amazonaws.com/334236250727/elite-dev');
