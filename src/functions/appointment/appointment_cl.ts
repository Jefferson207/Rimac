import { SQSEvent } from 'aws-lambda';
import * as AWS from 'aws-sdk';

const sqs = new AWS.SQS();
const statusQueueUrl = process.env.STATUS_QUEUE_URL!;

export const handler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    // Paso 1: parsear el body (mensaje SNS)
    const snsEnvelope = JSON.parse(record.body);

    // Paso 2: extraer y parsear el contenido real del mensaje SNS
    const message = JSON.parse(snsEnvelope.Message);

    console.log(`[${message.countryISO}] Procesando mensaje:`, message);

    // Reenviar mensaje a la cola event-status-queue
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
