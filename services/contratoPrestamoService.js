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
const tenant_1 = __importDefault(require("../database/models/tenant"));
const contratoPrestamo_1 = __importDefault(require("../database/models/contratoPrestamo"));
const moment_1 = __importDefault(require("moment"));
class ContratoPrestamoService {
    constructor(options) {
        this.options = options;
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield mongooseRepository_1.default.createSession(this.options.database);
            try {
                data.prestamistas = yield aporteRepository_1.default.filterIdsInTenant(data.prestamistas, Object.assign(Object.assign({}, this.options), { session }));
                data.deudor = yield deudorRepository_1.default.filterIdInTenant(data.deudor, Object.assign(Object.assign({}, this.options), { session }));
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
    _sendSmsToDeudor(data, isAuto = false, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const { deudor } = data;
            if (!deudor.telefono) {
                throw new Error400_1.default(options.language, 'entities.deudor.errors.telMissing');
            }
            const settings = yield settingsRepository_1.default.find(isAuto ? options : this.options);
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
            if (isAuto) {
                const variables = [
                    {
                        key: 'deudor',
                        value: deudor.nombre,
                    },
                    {
                        key: 'fecha',
                        value: data.fecha,
                    },
                    {
                        key: 'cantidadSolicitada',
                        value: data.cantidadSolicitada,
                    },
                    {
                        key: 'interés',
                        value: data.interes,
                    },
                ];
                const myMessage = this.replaceValueInText(settings.notifyMe, variables);
                new smsSender_1.default().sendTo(settings.myPhoneNumber, myMessage
                // `Se le notifica que el deudor ${deudor.nombre}, según el contrato establecido en la fecha ${data.fecha} por el monto de ${data.cantidadSolicitada} con el interés del ${data.interes}%, debe realizar el pago del interés al préstamo solicitado, el cual se cumple el día de mañana.`
                );
            }
            return new smsSender_1.default().sendTo(deudor.telefono, message);
        });
    }
    _notifyDeudaPending() {
        return __awaiter(this, void 0, void 0, function* () {
            const tenants = yield tenant_1.default(this.options.database).find({});
            for (const tenant of tenants) {
                const contratos = yield contratoPrestamo_1.default(this.options.database).find({ tenant: tenant.id });
                for (const contrato of contratos) {
                    const fechaEmision = moment_1.default(contratoPrestamoRepository_1.default.convertDigitIn(contrato.fecha));
                    const fechaActual = moment_1.default();
                    const duration = moment_1.default.duration(fechaActual.diff(fechaEmision));
                    const dayMonthsMora = 30;
                    const months = duration.months();
                    const days = duration.days();
                    const options = Object.assign(Object.assign({}, this.options), { currentTenant: { id: tenant.id } });
                    const settings = yield settingsRepository_1.default.find(options);
                    if (days === settings.missingDays) {
                        if (contrato.lastDateNotify != moment_1.default().format('DD-MM-yyyy')) {
                            yield this._sendSmsToDeudor(contrato, true, options);
                            yield contratoPrestamo_1.default(this.options.database).find({ tenant: tenant.id, lastDateNotify: moment_1.default().format('DD-MM-yyyy') });
                        }
                    }
                }
            }
            return true;
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