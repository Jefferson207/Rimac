export const handler = async (event) => {
    for (const record of event.Records) {
        const message = JSON.parse(record.body);
        console.log('Procesando mensaje PE:', message);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Procesado PE' }),
    };
};
//# sourceMappingURL=pe.js.map