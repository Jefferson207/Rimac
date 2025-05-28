import { Appointment } from '../../domain/models/Appointment';
import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository';
import * as AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMO_TABLE!;

export class DynamoAppointmentRepository implements AppointmentRepository {
  async save(appointment: Appointment): Promise<void> {
    await dynamo.put({
      TableName: tableName,
      Item: appointment,
    }).promise();
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const result = await dynamo.query({
      TableName: tableName,
      KeyConditionExpression: 'insuredId = :insuredId',
      ExpressionAttributeValues: {
        ':insuredId': insuredId,
      },
    }).promise();

    return result.Items as Appointment[];
  }

  async updateStatus(insuredId: string, scheduleId: number, status: string): Promise<void> {
    await dynamo.update({
      TableName: tableName,
      Key: {
        insuredId,
        scheduleId,
      },
      UpdateExpression: 'SET #s = :s',
      ExpressionAttributeNames: {
        '#s': 'status',
      },
      ExpressionAttributeValues: {
        ':s': status,
      },
    }).promise();
  }
}
