import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMO_TABLE;
export const createAppointment = async (event) => {
    try {
        const data = JSON.parse(event.body || '{}');
        const item = {
            insuredId: data.insuredId,
            scheduleId: data.scheduleId,
            countryISO: data.countryISO,
            status: 'pending',
            requestId: uuidv4(),
            createdAt: new Date().toISOString(),
        };
        await dynamo.put({
            TableName: tableName,
            Item: item,
        }).promise();
        const sns = new AWS.SNS();
        await sns.publish({
            TopicArn: process.env.SNS_TOPIC_ARN,
            Message: JSON.stringify(item),
            MessageAttributes: {
                countryISO: {
                    DataType: 'String',
                    StringValue: item.countryISO,
                },
            },
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Agendamiento registrado', data: item }),
        };
    }
    catch (error) {
        console.error('Error creando cita:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al crear el agendamiento' }),
        };
    }
};
//# sourceMappingURL=handler.js.map