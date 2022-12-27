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
const html_pdf_node_1 = __importDefault(require("html-pdf-node"));
const settingsRepository_1 = __importDefault(require("./../database/repositories/settingsRepository"));
const cheerio_1 = __importDefault(require("cheerio"));
class ApiResponseHandler {
    static download(req, res, path) {
        return __awaiter(this, void 0, void 0, function* () {
            res.download(path);
        });
    }
    static success(req, res, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            if (payload !== undefined) {
                res.status(200).send(payload);
            }
            else {
                res.sendStatus(200);
            }
        });
    }
    static error(req, res, error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (error &&
                [400, 401, 403, 404].includes(error.code)) {
                res.status(error.code).send(error.message);
            }
            else {
                console.error(error);
                res.status(500).send(error.message);
            }
        });
    }
    static replaceValueInHtml(html, values) {
        let result = html;
        for (const item of values) {
            const { key, value } = item;
            result = result.replace(`\${${key}}`, value);
        }
        return result;
    }
    static downloadContratoPrestamo(req, res, data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const settings = yield settingsRepository_1.default.find(req);
            let { html, css } = settings.contractDesign;
            const variables = [
                {
                    key: 'prestamista',
                    value: settings.ownerPrestamista,
                },
                {
                    key: 'deudor',
                    value: data.deudor.nombre,
                },
                {
                    key: 'cantidadSolicitada',
                    value: data.cantidadSolicitada,
                },
                {
                    key: 'duracionPrestamo',
                    value: `${data.duracionPrestamo} meses`,
                },
                {
                    key: 'fecha',
                    value: data.fecha,
                },
            ];
            const $ = cheerio_1.default.load(html);
            $('[alt=${fotoFirmaDeudor}]').attr('src', (_a = data.fotoFirma[0]) === null || _a === void 0 ? void 0 : _a.downloadUrl);
            html = $('body').html();
            html = html.replace(/ class="blocked"/g, '');
            html = this.replaceValueInHtml(html, variables);
            const content = `<style>${css}</style>${html}`;
            const file = { content };
            const options = {
                format: 'A4',
                margin: {
                    left: 20,
                    right: 20,
                }
            };
            html_pdf_node_1.default.generatePdf(file, options).then(pdfBuffer => {
                res.setHeader('Content-Type', 'application/pdf');
                res.send(pdfBuffer);
            });
        });
    }
}
exports.default = ApiResponseHandler;
//# sourceMappingURL=apiResponseHandler.js.map