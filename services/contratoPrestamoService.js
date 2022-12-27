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
const Error400_1 = __importDefault(require("../errors/Error400"));
const mongooseRepository_1 = __importDefault(require("../database/repositories/mongooseRepository"));
const contratoPrestamoRepository_1 = __importDefault(require("../database/repositories/contratoPrestamoRepository"));
const aporteRepository_1 = __importDefault(require("../database/repositories/aporteRepository"));
const deudorRepository_1 = __importDefault(require("../database/repositories/deudorRepository"));
const smsSender_1 = __importDefault(require("./smsSender"));
const settingsRepository_1 = __importDefault(require("../database/repositories/settingsRepository"));
class ContratoPrestamoService {
    constructor(options) {
        this.options = options;
    }
    create(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                data.prestamistas = yield aporteRepository_1.default.filterIdsInTenant(data.prestamistas, Object.assign(Object.assign({}, this.options), { session }));
                data.deudor = yield deudorRepository_1.default.filterIdInTenant((_a = data.deudor) === null || _a === void 0 ? void 0 : _a.id, Object.assign(Object.assign({}, this.options), { session }));
                const record = yield contratoPrestamoRepository_1.default.create(data, Object.assign(Object.assign({}, this.options), { session }));
                yield mongooseRepository_1.default.commitTransaction(session);
                return record;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                mongooseRepository_1.default.handleUniqueFieldError(error, this.options.language, 'contratoPrestamo');
                throw error;
            }
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                data.prestamistas = yield aporteRepository_1.default.filterIdsInTenant(data.prestamistas, Object.assign(Object.assign({}, this.options), { session }));
                data.deudor = yield deudorRepository_1.default.filterIdInTenant(data.deudor, Object.assign(Object.assign({}, this.options), { session }));
                const record = yield contratoPrestamoRepository_1.default.update(id, data, Object.assign(Object.assign({}, this.options), { session }));
                yield mongooseRepository_1.default.commitTransaction(session);
                return record;
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                mongooseRepository_1.default.handleUniqueFieldError(error, this.options.language, 'contratoPrestamo');
                throw error;
            }
        });
    }
    destroyAll(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                for (const id of ids) {
                    yield contratoPrestamoRepository_1.default.destroy(id, Object.assign(Object.assign({}, this.options), { session }));
                }
                yield mongooseRepository_1.default.commitTransaction(session);
            }
            catch (error) {
                yield mongooseRepository_1.default.abortTransaction(session);
                throw error;
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return contratoPrestamoRepository_1.default.findById(id, this.options);
        });
    }
    findAllAutocomplete(search, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return contratoPrestamoRepository_1.default.findAllAutocomplete(search, limit, this.options);
        });
    }
    findAndCountAll(args) {
        return __awaiter(this, void 0, void 0, function* () {
            return contratoPrestamoRepository_1.default.findAndCountAll(args, this.options);
        });
    }
    import(data, importHash) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!importHash) {
                throw new Error400_1.default(this.options.language, 'importer.errors.importHashRequired');
            }
            if (yield this._isImportHashExistent(importHash)) {
                throw new Error400_1.default(this.options.language, 'importer.errors.importHashExistent');
            }
            const dataToCreate = Object.assign(Object.assign({}, data), { importHash });
            return this.create(dataToCreate);
        });
    }
    replaceValueInText(text, values) {
        let result = text;
        for (const item of values) {
            const { key, value } = item;
            result = result.replace(`\${${key}}`, value);
        }
        return result;
    }
    _sendSmsToDeudor(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deudor } = data;
            if (!deudor.telefono)
                return;
            const settings = yield settingsRepository_1.default.find(this.options);
            const variables = [
                {
                    key: 'deudor',
                    value: deudor.nombre,
                },
                {
                    key: 'ownerPrestamista',
                    value: settings.ownerPrestamista,
                }
            ];
            const message = this.replaceValueInText(settings.notifyMessage, variables);
            return new smsSender_1.default().sendTo(deudor.telefono, message);
        });
    }
    _isImportHashExistent(importHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const count = yield contratoPrestamoRepository_1.default.count({
                importHash,
            }, this.options);
            return count > 0;
        });
    }
}
exports.default = ContratoPrestamoService;
//# sourceMappingURL=contratoPrestamoService.js.map