/**
 * @swagger
 * /appointment:
 *   post:
 *     summary: Crea una nueva cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               insuredId:
 *                 type: string
 *               scheduleId:
 *                 type: integer
 *               countryISO:
 *                 type: string
 *             required:
 *               - insuredId
 *               - scheduleId
 *               - countryISO
 *     responses:
 *       200:
 *         description: Cita creada exitosamente
 *
 * /appointment/{insuredId}:
 *   get:
 *     summary: Obtiene citas por insuredId
 *     parameters:
 *       - in: path
 *         name: insuredId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de citas
 */

import { APIGatewayProxyHandler, SQSEvent } from 'aws-lambda';
import { CreateAppointment } from '@/application/useCases/CreateAppointment';
import { GetAppointmentsByInsuredId } from '@/application/useCases/GetAppointmentsByInsuredId';
import { UpdateAppointmentStatus } from '@/application/useCases/UpdateAppointmentStatus';

import { SNSPublisher } from '@/infrastructure/sns/SNSPublisher';
import { DynamoAppointmentRepository } from '@/infrastructure/db/DynamoAppointmentRepository';

export const main = async (event: any) => {
  const repo = new DynamoAppointmentRepository();

  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const sns = new SNSPublisher();
    const useCase = new CreateAppointment(repo, sns);
    const result = await useCase.execute(body);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }

  if (event.httpMethod === 'GET') {
    const insuredId = event.pathParameters?.insuredId;

    if (!insuredId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'insuredId es requerido' }),
      };
    }

    const useCase = new GetAppointmentsByInsuredId(repo);
    const result = await useCase.execute(insuredId);

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  }

  // Procesar evento desde SQS (EventStatusQueue)
  if (event.Records && Array.isArray(event.Records)) {
    const useCase = new UpdateAppointmentStatus(repo);

    for (const record of event.Records) {
      const message = JSON.parse(record.body);
      const { insuredId, scheduleId } = message;

      if (insuredId && scheduleId) {
        await useCase.execute(insuredId, scheduleId);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Estados actualizados' }),
    };
  }

  return {
    statusCode: 400,
    body: JSON.stringify({ message: 'Método no permitido' }),
  };
};
