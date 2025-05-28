import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';
const dynamo = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
const tableName = process.env.DYNAMO_TABLE;
const topicArn = process.env.SNS_TOPIC_ARN;
export const main = async (event) => {
    if (event.httpMethod) {
        if (event.httpMethod === 'POST') {
            return await createAppointment(event);
        }
        else if (event.httpMethod === 'GET') {
            return await getAppointment(event);
        }
    }
    if (event.Records) {
        return await handleStatusUpdate(event);
    }
    return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No se pudo procesar la solicitud' }),
    };
};
const createAppointment = async (event) => {
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
        await sns.publish({
            TopicArn: topicArn,
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
const getAppointment = async (event) => {
    try {
        const insuredId = event.pathParameters?.insuredId;
        if (!insuredId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Falta insuredId' }),
            };
        }
        const result = await dynamo.query({
            TableName: tableName,
            KeyConditionExpression: 'insuredId = :insuredId',
            ExpressionAttributeValues: {
                ':insuredId': insuredId,
            },
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ appointments: result.Items }),
        };
    }
    catch (error) {
        console.error('Error obteniendo cita:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al obtener la cita' }),
        };
    }
};
const handleStatusUpdate = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        if (message.insuredId && message.scheduleId) {
            await dynamo.update({
                TableName: tableName,
                Key: {
                    insuredId: message.insuredId,
                    scheduleId: message.scheduleId,
                },
                UpdateExpression: 'SET #s = :s',
                ExpressionAttributeNames: {
                    '#s': 'status',
                },
                ExpressionAttributeValues: {
                    ':s': 'completed',
                },
            }).promise();
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Estados actualizados' }),
    };
};
//# sourceMappingURL=index.js.map