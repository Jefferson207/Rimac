"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        console.log('Procesando mensaje CL:', message);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Procesado appointment_cl' }),
    };
};
exports.handler = handler;
