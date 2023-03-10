"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const TenantUserSchema = new Schema({
    tenant: {
        type: Schema.Types.ObjectId,
        ref: 'tenant',
        required: true
    },
    roles: [{ type: String, maxlength: 255 }],
    invitationToken: { type: String, maxlength: 255 },
    status: {
        type: String,
        required: true,
        enum: ['active', 'invited'],
    },
}, { timestamps: true });
TenantUserSchema.virtual('id').get(function () {
    // @ts-ignore
    return this._id.toHexString();
});
TenantUserSchema.set('toJSON', {
    getters: true,
});
TenantUserSchema.set('toObject', {
    getters: true,
});
exports.default = TenantUserSchema;
//# sourceMappingURL=tenantUserSchema.js.map