import * as AWS from 'aws-sdk';
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMO_TABLE;
export const main = async (event) => {
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body);
            const { insuredId, scheduleId } = body;
            const params = {
                TableName: tableName,
                Key: {
                    insuredId,
                    scheduleId,
                },
                UpdateExpression: 'SET #status = :status',
                ExpressionAttributeNames: {
                    '#status': 'status',
                },
                ExpressionAttributeValues: {
                    ':status': 'completed',
                },
            };
            await dynamo.update(params).promise();
            console.log(`✅ Estado actualizado a 'completed' para insuredId=${insuredId}, scheduleId=${scheduleId}`);
        }
        catch (err) {
            console.error('❌ Error actualizando estado:', err);
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Mensajes procesados correctamente' }),
    };
};
//# sourceMappingURL=index.js.map