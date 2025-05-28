import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import serverless from 'serverless-http';

const app = express();

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rimac Appointments API',
      version: '1.0.0',
      description: 'Documentación de la API de citas médicas de Rimac',
    },
  },
  apis: [__dirname + '/appointment.yaml'], // RUTA LOCAL ABSOLUTA CORRECTA
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export const handler = serverless(app);
