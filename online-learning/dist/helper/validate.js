"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const validateZod = zod_1.z.object({
    MONGO_URL: zod_1.z.string(),
    EMAIL: zod_1.z.string().email()
});
exports.default = validateZod;
