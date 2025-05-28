import { SQSEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const sqs = new AWS.SQS();
const statusQueueUrl = process.env.STATUS_QUEUE_URL!;

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {

    const snsEnvelope = JSON.parse(record.body);

    const message = JSON.parse(snsEnvelope.Message);

    console.log(`[${message.countryISO}] Procesando mensaje:`, message);

    await sqs.sendMessage({
      QueueUrl: statusQueueUrl,
      MessageBody: JSON.stringify({
        insuredId: message.insuredId,
        scheduleId: message.scheduleId,
      }),
    }).promise();

    console.log(`[${message.countryISO}] Estado reenviado para actualizar.`);
  }
};
