"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('fondo');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const FondoSchema = new Schema({
        prestamista: {
            type: Schema.Types.ObjectId,
            ref: 'prestamista',
            required: true,
        },
        cantidad: {
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
    FondoSchema.index({ importHash: 1, tenant: 1 }, {
        unique: true,
        partialFilterExpression: {
            importHash: { $type: 'string' },
        },
    });
    FondoSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    FondoSchema.set('toJSON', {
        getters: true,
    });
    FondoSchema.set('toObject', {
        getters: true,
    });
    return database.model('fondo', FondoSchema);
};
//# sourceMappingURL=fondo.js.map