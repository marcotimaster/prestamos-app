"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const fileSchema_1 = __importDefault(require("./schemas/fileSchema"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('pago');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PagoSchema = new Schema({
        contratoId: {
            type: Schema.Types.ObjectId,
            ref: 'contratoPrestamo',
            required: true,
        },
        fecha: {
            type: String,
            required: true,
        },
        tipo: {
            type: String,
            required: true,
            enum: [
                "Interés",
                "Capital"
            ],
        },
        cantidad: {
            type: Number,
            required: true,
            min: 0,
        },
        evidenciaPago: [fileSchema_1.default],
        tenant: {
            type: Schema.Types.ObjectId,
            ref: 'tenant',
            required: true
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        updatedBy: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        importHash: { type: String },
    }, { timestamps: true });
    PagoSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PagoSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    PagoSchema.set('toJSON', {
        getters: true,
    });
    PagoSchema.set('toObject', {
        getters: true,
    });
    return database.model('pago', PagoSchema);
};
//# sourceMappingURL=pago.js.map