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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Presion = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_aggregate_paginate_v2_1 = __importDefault(require("mongoose-aggregate-paginate-v2"));
const presionSchema = new mongoose_1.Schema({
    id: Number,
    dateOfCreated: {
        type: Date,
        default: Date.now
    },
    registroPresionAlta: Number,
    registroPresionBaja: Number,
    tipoPresion: String,
    userID: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    }
});
presionSchema.plugin(mongoose_aggregate_paginate_v2_1.default);
// Note: OverwriteModelError: Cannot overwrite `Certificates` model once compiled. error
exports.Presion = (mongoose_1.default.models.presion || mongoose_1.default.model('presion', presionSchema, "presion"));
//# sourceMappingURL=Ipresion.js.map