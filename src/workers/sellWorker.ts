// workers/sellWorker.ts
import { sendMessage } from '../messaging/AwsQueuingService';

interface SellRequestData {
  item: string;
  quantity: number;
}

export const enqueueSellRequest = async (sellRequestData: SellRequestData, queueUrl: string) => {
  try {
    const messageBody = JSON.stringify(sellRequestData);

    // Send the message to the SQS queue
    await sendMessage(queueUrl, messageBody);

    console.log(`Sell request enqueued: ${messageBody}`);
  } catch (error) {
    console.error('Error enqueueing sell request:', error);
    throw error;
  }
};

// Call the enqueueSellRequest function here or export it for external use
