"use strict";
// validators/addItemValidator.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAddItem = void 0;
const joi_1 = __importDefault(require("joi"));
const addItemSchema = joi_1.default.object({
    quantity: joi_1.default.number().required(),
    expiry: joi_1.default.number().required(),
});
const validateAddItem = (req, res, next) => {
    const { error } = addItemSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};
exports.validateAddItem = validateAddItem;
