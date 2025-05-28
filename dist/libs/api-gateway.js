"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatJSONResponse = void 0;
const formatJSONResponse = (response) => {
    return {
        statusCode: 200,
        body: JSON.stringify(response)
    };
};
exports.formatJSONResponse = formatJSONResponse;
