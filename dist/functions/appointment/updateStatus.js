"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = void 0;
const AWS = __importStar(require("aws-sdk"));
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMO_TABLE;
const main = async (event, _context) => {
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
exports.main = main;
