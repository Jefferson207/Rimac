import { APIGatewayProxyHandler } from 'aws-lambda';
import { swaggerSpec } from '@/docs/swagger';

export const main: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(swaggerSpec),
  };
};
