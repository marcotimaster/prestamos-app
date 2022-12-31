"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('deudor');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const DeudorSchema = new Schema({
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
        deudaPendiente: {
            type: Number,
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
    DeudorSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    DeudorSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    DeudorSchema.set('toJSON', {
        getters: true,
    });
    DeudorSchema.set('toObject', {
        getters: true,
    });
    return database.model('deudor', DeudorSchema);
};
//# sourceMappingURL=deudor.js.map