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
exports.createAppointment = void 0;
const AWS = __importStar(require("aws-sdk"));
const uuid_1 = require("uuid");
const dynamo = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMO_TABLE;
const createAppointment = async (event) => {
    try {
        const data = JSON.parse(event.body || '{}');
        const item = {
            insuredId: data.insuredId,
            scheduleId: data.scheduleId,
            countryISO: data.countryISO,
            status: 'pending',
            requestId: (0, uuid_1.v4)(),
            createdAt: new Date().toISOString(),
        };
        await dynamo.put({
            TableName: tableName,
            Item: item,
        }).promise();
        const sns = new AWS.SNS();
        await sns.publish({
            TopicArn: process.env.SNS_TOPIC_ARN,
            Message: JSON.stringify(item),
            MessageAttributes: {
                countryISO: {
                    DataType: 'String',
                    StringValue: item.countryISO,
                },
            },
        }).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Agendamiento registrado', data: item }),
        };
    }
    catch (error) {
        console.error('Error creando cita:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error al crear el agendamiento' }),
        };
    }
};
exports.createAppointment = createAppointment;
