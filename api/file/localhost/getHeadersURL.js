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
const Error400_1 = __importDefault(require("../../../errors/Error400"));
const apiResponseHandler_1 = __importDefault(require("../../apiResponseHandler"));
/**
 * Download a file from localhost.
 */
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const url = req.query.url;
        if (!url) {
            throw new Error400_1.default(req.language);
        }
        // res.set("Content-Type", "image/jpeg");
        yield apiResponseHandler_1.default.getHeadersURL(req, res, url);
    }
    catch (error) {
        yield apiResponseHandler_1.default.error(req, res, error);
    }
});
//# sourceMappingURL=getHeadersURL.js.map