"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const mongoose_1 = __importDefault(require("mongoose"));
const design1_1 = __importStar(require("../../design/design1"));
const fileSchema_1 = __importDefault(require("./schemas/fileSchema"));
const Schema = mongoose_1.default.Schema;
exports.default = (database) => {
    try {
        return database.model('settings');
    }
    catch (error) {
        // continue, because model doesnt exist
    }
    const SettingsSchema = new Schema({
        theme: { type: String, required: true },
        backgroundImages: [fileSchema_1.default],
        logos: [fileSchema_1.default],
        ownerPrestamista: {
            type: String
        },
        notifyMessage: {
            type: String,
            default: 'Estimado(a) prestatario(a) ${deudor}, mediante la misma se le comunica que está muy atrasado en sus pagos de acuerdo al contrato de préstamo establecido, por lo que se le solicita con urgencia ponerse al día con los pagos. Atentamente ${ownerPrestamista}, saludos cordiales.',
        },
        contractDesign: {
            html: {
                type: String,
                default: design1_1.default,
            },
            css: {
                type: String,
                default: design1_1.cssdesign1,
            }
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
    }, { timestamps: true });
    SettingsSchema.virtual('id').get(function () {
        // @ts-ignore
        return this._id.toHexString();
    });
    SettingsSchema.set('toJSON', {
        getters: true,
    });
    SettingsSchema.set('toObject', {
        getters: true,
    });
    return database.model('settings', SettingsSchema);
};
//# sourceMappingURL=settings.js.map