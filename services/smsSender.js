"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const twilio_1 = __importDefault(require("twilio"));
const accountSid = config_1.getConfig().TWILIO_ACCOUNT_SID;
const authToken = config_1.getConfig().TWILIO_AUTH_TOKEN;
const client = twilio_1.default(accountSid, authToken);
class SmsSender {
    constructor() {
    }
    sendTo(to, body) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!SmsSender.isConfigured) {
                console.error(`Email provider is not configured.`);
                return;
            }
            try {
                return yield client.messages.create({
                    to,
                    from: config_1.getConfig().TWILIO_PHONE_NUMBER,
                    body
                });
            }
            catch (error) {
                console.error('Error sending Twilio sms.');
                console.error(error);
                throw error;
            }
        });
    }
    static get isConfigured() {
        return Boolean(config_1.getConfig().TWILIO_ACCOUNT_SID &&
            config_1.getConfig().TWILIO_AUTH_TOKEN &&
            config_1.getConfig().TWILIO_PHONE_NUMBER);
    }
}
exports.default = SmsSender;
//# sourceMappingURL=smsSender.js.map