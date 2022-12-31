"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('prestamista');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const PrestamistaSchema = new Schema({
        dni: {
            type: String,
        },
        nombre: {
            type: String,
            required: true,
        },
        telefono: {
            type: String,
        },
        tags: [{
                type: Schema.Types.ObjectId,
                ref: 'tag',
            }],
        capitalDisponible: {
            type: Number,
            required: true,
            min: 0,
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
    PrestamistaSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    PrestamistaSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    PrestamistaSchema.set('toJSON', {
        getters: true,
    });
    PrestamistaSchema.set('toObject', {
        getters: true,
    });
    return database.model('prestamista', PrestamistaSchema);
};
//# sourceMappingURL=prestamista.js.map