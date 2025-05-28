import * as AWS from 'aws-sdk';
const sqs = new AWS.SQS();
const statusQueueUrl = process.env.STATUS_QUEUE_URL;
export const handler = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
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
//# sourceMappingURL=appointment_cl.js.map