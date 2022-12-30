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
        return database.model('contratoPrestamo');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const ContratoPrestamoSchema = new Schema({
        prestamistas: [{
                type: Schema.Types.ObjectId,
                ref: 'aporte',
                required: true,
            }],
        deudor: {
            type: Schema.Types.ObjectId,
            ref: 'deudor',
            required: true,
        },
        fecha: {
            type: String,
            required: true,
        },
        duracionPrestamo: {
            type: Number,
            required: true,
            min: 0,
        },
        cantidadSolicitada: {
            type: Number,
            required: true,
            min: 0,
        },
        interes: {
            type: Number,
            required: true,
            min: 0,
        },
        estado: {
            type: String,
            required: true,
            enum: [
                "Vigente",
                "Cancelado"
            ],
        },
        capitalPendiente: {
            type: Number,
            required: true,
            min: 0,
        },
        interesPendiente: {
            type: Number,
            required: true,
        },
        capitalPagado: {
            type: Number,
            required: true,
            min: 0,
        },
        interesPagado: {
            type: Number,
            required: true,
            min: 0,
        },
        observacion: {
            type: String,
        },
        fotoFirma: [fileSchema_1.default],
        lastDateNotify: {
            type: String,
        },
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
    ContratoPrestamoSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    ContratoPrestamoSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    ContratoPrestamoSchema.set('toJSON', {
        getters: true,
    });
    ContratoPrestamoSchema.set('toObject', {
        getters: true,
    });
    return database.model('contratoPrestamo', ContratoPrestamoSchema);
};
//# sourceMappingURL=contratoPrestamo.js.map