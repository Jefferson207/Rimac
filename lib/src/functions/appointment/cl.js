export const handler = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        console.log('Procesando mensaje CL:', message);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Procesado CL' }),
    };
};
//# sourceMappingURL=cl.js.map