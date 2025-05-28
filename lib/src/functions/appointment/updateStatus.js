import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMO_TABLE;
export const main = async (event, _context) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        const { insuredId, scheduleId } = message;
        console.log(`Actualizando estado para insuredId=${insuredId}, scheduleId=${scheduleId}`);
        const params = {
            TableName: tableName,
            Key: {
                insuredId: insuredId,
                scheduleId: scheduleId,
            },
            UpdateExpression: 'set #st = :newStatus',
            ExpressionAttributeNames: {
                '#st': 'status',
            },
            ExpressionAttributeValues: {
                ':newStatus': 'completed',
            },
        };
        try {
            await dynamo.update(params).promise();
            console.log(`Estado actualizado correctamente`);
        }
        catch (err) {
            console.error('Error al actualizar el estado:', err);
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Procesamiento de cola completado' }),
    };
};
//# sourceMappingURL=updateStatus.js.map