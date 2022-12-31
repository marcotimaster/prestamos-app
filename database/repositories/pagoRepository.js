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
const mongooseRepository_1 = __importDefault(require("./mongooseRepository"));
const mongooseQueryUtils_1 = __importDefault(require("../utils/mongooseQueryUtils"));
const auditLogRepository_1 = __importDefault(require("./auditLogRepository"));
const Error404_1 = __importDefault(require("../../errors/Error404"));
const lodash_1 = __importDefault(require("lodash"));
const pago_1 = __importDefault(require("../models/pago"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
const deudorRepository_1 = __importDefault(require("./deudorRepository"));
const contratoPrestamoRepository_1 = __importDefault(require("./contratoPrestamoRepository"));
const Error400_1 = __importDefault(require("../../errors/Error400"));
class PagoRepository {
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            const [record] = yield pago_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            yield this.createPagoContratoPrestamo(data.contratoId, data.tipo, data.cantidad, options);
            yield this.createPagoDeudor(data.contratoId, data.tipo, data.cantidad, options);
            return this.findById(record.id, options);
        });
    }
    static createPagoDeudor(contratoId, tipo, cantidad, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (contratoId) {
                const contrato = yield contratoPrestamoRepository_1.default.findById(contratoId, options);
                if (contrato) {
                    const deudor = yield deudorRepository_1.default.findById(contrato.deudor, options);
                    if (deudor) {
                        const newCantidad = deudor.deudaPendiente - cantidad;
                        yield deudorRepository_1.default.update(deudor.id, Object.assign(Object.assign({}, deudor), { deudaPendiente: newCantidad }), options);
                    }
                    if (tipo === 'Interés') {
                        const newInteres = contrato.interesPendiente - cantidad;
                        yield contratoPrestamoRepository_1.default.update(contratoId, Object.assign(Object.assign({}, contrato), { interesPendiente: newInteres }), options);
                    }
                    else if (tipo === 'Capital') {
                        const newCapital = contrato.capitalPendiente - cantidad;
                        yield contratoPrestamoRepository_1.default.update(contratoId, Object.assign(Object.assign({}, contrato), { capitalPendiente: newCapital }), options);
                    }
                }
            }
        });
    }
    static createPagoContratoPrestamo(contratoId, tipo, cantidad, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (contratoId) {
                const contrato = yield contratoPrestamoRepository_1.default.findById(contratoId, options);
                if (contrato) {
                    let newInteresPagado = contrato.interesPagado;
                    let newCapitalPagado = contrato.capitalPagado;
                    let newInteresPendiente = contrato.interesPendiente;
                    let newCapitalPendiente = contrato.capitalPendiente;
                    if (tipo === 'Interés') {
                        newInteresPagado += cantidad;
                        newInteresPendiente -= cantidad;
                    }
                    else if (tipo === 'Capital') {
                        newCapitalPagado += cantidad;
                        newCapitalPendiente -= cantidad;
                    }
                    if (newCapitalPagado > contrato.capitalPagado) {
                        throw new Error400_1.default(options.language, 'entities.pago.errors.exceed');
                    }
                    yield contratoPrestamoRepository_1.default.update(contratoId, Object.assign(Object.assign({}, contrato), { interesPendiente: newInteresPendiente, capitalPendiente: newCapitalPendiente, interesPagado: newInteresPagado, capitalPagado: newCapitalPagado }), options);
                }
            }
        });
    }
    static updatePagoDeudor(contratoId, prevCantidad, nextCantidad, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const contrato = yield contratoPrestamoRepository_1.default.findById(contratoId, options);
            if (contrato) {
                const deudor = yield deudorRepository_1.default.findById(contrato.deudor, options);
                if (deudor) {
                    const newCantidad = (deudor.deudaPendiente + prevCantidad) - nextCantidad;
                    yield deudorRepository_1.default.update(deudor.id, Object.assign(Object.assign({}, deudor), { deudaPendiente: newCantidad }), options);
                }
            }
        });
    }
    static updatePagoContratoPrestamo(contratoId, prevTipo, newTipo, prevCantidad, newCantidad, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const contrato = yield contratoPrestamoRepository_1.default.findById(contratoId, options);
            if (contrato) {
                let newInteresPagado = contrato.interesPagado;
                let newCapitalPagado = contrato.capitalPagado;
                let newInteresPendiente = contrato.interesPendiente;
                let newCapitalPendiente = contrato.capitalPendiente;
                if (prevTipo === 'Interés' && newTipo === 'Capital') {
                    newCapitalPagado += newCantidad;
                    newInteresPagado -= prevCantidad;
                    newCapitalPendiente -= newCantidad;
                    newInteresPendiente += prevCantidad;
                }
                else if (prevTipo === 'Capital' && newTipo === 'Interés') {
                    newInteresPagado += newCantidad;
                    newCapitalPagado -= prevCantidad;
                    newInteresPendiente -= newCantidad;
                    newCapitalPagado += prevCantidad;
                }
                else {
                    if (newTipo === 'Interés') {
                        newInteresPagado = (newInteresPagado - prevCantidad) + newCantidad;
                        newInteresPendiente = (newInteresPendiente + prevCantidad) - newCantidad;
                    }
                    else if (newTipo === 'Capital') {
                        newCapitalPagado = (newCapitalPagado - prevCantidad) + newCantidad;
                        newCapitalPendiente = (newCapitalPendiente + prevCantidad) - newCantidad;
                    }
                }
                if (newCapitalPagado > contrato.capitalPagado) {
                    throw new Error400_1.default(options.language, 'entities.pago.errors.exceed');
                }
                yield contratoPrestamoRepository_1.default.update(contratoId, Object.assign(Object.assign({}, contrato), { interesPendiente: newInteresPendiente, capitalPendiente: newCapitalPendiente, interesPagado: newInteresPagado, capitalPagado: newCapitalPagado }), options);
            }
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(pago_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield pago_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            yield this.updatePagoContratoPrestamo(data.contratoId, record.tipo, data.tipo, record.cantidad, data.cantidad, options);
            yield this.updatePagoDeudor(data.contratoId, record.cantidad, data.cantidad, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static devolutionPagoContratoPrestamo(contratoId, tipo, cantidad, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (contratoId) {
                const contrato = yield contratoPrestamoRepository_1.default.findById(contratoId, options);
                if (contrato) {
                    let newInteresPagado = contrato.interesPagado;
                    let newCapitalPagado = contrato.capitalPagado;
                    let newInteresPendiente = contrato.interesPendiente;
                    let newCapitalPendiente = contrato.capitalPendiente;
                    if (tipo === 'Interés') {
                        newInteresPagado -= cantidad;
                        newInteresPendiente += cantidad;
                    }
                    else if (tipo === 'Capital') {
                        newCapitalPagado -= cantidad;
                        newCapitalPendiente += cantidad;
                    }
                    yield contratoPrestamoRepository_1.default.update(contratoId, Object.assign(Object.assign({}, contrato), { interesPendiente: newInteresPendiente, capitalPendiente: newCapitalPendiente, interesPagado: newInteresPagado, capitalPagado: newCapitalPagado }), options);
                }
            }
        });
    }
    static devolutionPagoDeudor(contratoId, cantidad, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (contratoId) {
                const contrato = yield contratoPrestamoRepository_1.default.findById(contratoId, options);
                if (contrato) {
                    const deudor = yield deudorRepository_1.default.findById(contrato.deudor, options);
                    if (deudor) {
                        const newCantidad = deudor.deudaPendiente + cantidad;
                        yield deudorRepository_1.default.update(deudor.id, Object.assign(Object.assign({}, deudor), { deudaPendiente: newCantidad }), options);
                    }
                    const newDeuda = contrato.deudaPendiente + cantidad;
                    yield contratoPrestamoRepository_1.default.update(contratoId, Object.assign(Object.assign({}, contrato), { deudaPendiente: newDeuda }), options);
                }
            }
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(pago_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield pago_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield this.devolutionPagoDeudor(record.contrato, record.cantidad, options);
            yield this.devolutionPagoContratoPrestamo(record.contratoId, record.tipo, record.cantidad, options);
        });
    }
    static filterIdInTenant(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return lodash_1.default.get(yield this.filterIdsInTenant([id], options), '[0]', null);
        });
    }
    static filterIdsInTenant(ids, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!ids || !ids.length) {
                return [];
            }
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const records = yield pago_1.default(options.database)
                .find({
                _id: { $in: ids },
                tenant: currentTenant.id,
            })
                .select(['_id']);
            return records.map((record) => record._id);
        });
    }
    static count(filter, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            return mongooseRepository_1.default.wrapWithSessionIfExists(pago_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(pago_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id })
                .populate('deudor')
                .populate('contratoId'), options);
            if (!record) {
                throw new Error404_1.default();
            }
            return this._mapRelationshipsAndFillDownloadUrl(record);
        });
    }
    static findAndCountAll({ filter, limit = 0, offset = 0, orderBy = '' }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [];
            criteriaAnd.push({
                tenant: currentTenant.id,
            });
            if (filter) {
                if (filter.id) {
                    criteriaAnd.push({
                        ['_id']: mongooseQueryUtils_1.default.uuid(filter.id),
                    });
                }
                if (filter.deudor) {
                    criteriaAnd.push({
                        deudor: mongooseQueryUtils_1.default.uuid(filter.deudor),
                    });
                }
                if (filter.contratoId) {
                    criteriaAnd.push({
                        contratoId: mongooseQueryUtils_1.default.uuid(filter.contratoId),
                    });
                }
                if (filter.fechaRange) {
                    const [start, end] = filter.fechaRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            fecha: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            fecha: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.tipo) {
                    criteriaAnd.push({
                        tipo: filter.tipo
                    });
                }
                if (filter.cantidadRange) {
                    const [start, end] = filter.cantidadRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            cantidad: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            cantidad: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.createdAtRange) {
                    const [start, end] = filter.createdAtRange;
                    if (start !== undefined &&
                        start !== null &&
                        start !== '') {
                        criteriaAnd.push({
                            ['createdAt']: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined &&
                        end !== null &&
                        end !== '') {
                        criteriaAnd.push({
                            ['createdAt']: {
                                $lte: end,
                            },
                        });
                    }
                }
            }
            const sort = mongooseQueryUtils_1.default.sort(orderBy || 'createdAt_DESC');
            const skip = Number(offset || 0) || undefined;
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = criteriaAnd.length
                ? { $and: criteriaAnd }
                : null;
            let rows = yield pago_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate('deudor')
                .populate('contratoId');
            const count = yield pago_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map(this._mapRelationshipsAndFillDownloadUrl));
            return { rows, count };
        });
    }
    static findAllAutocomplete(search, limit, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [{
                    tenant: currentTenant.id,
                }];
            if (search) {
                criteriaAnd.push({
                    $or: [
                        {
                            _id: mongooseQueryUtils_1.default.uuid(search),
                        },
                    ],
                });
            }
            const sort = mongooseQueryUtils_1.default.sort('id_ASC');
            const limitEscaped = Number(limit || 0) || undefined;
            const criteria = { $and: criteriaAnd };
            const records = yield pago_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort);
            return records.map((record) => ({
                id: record.id,
                label: record.id,
            }));
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: pago_1.default(options.database).modelName,
                entityId: id,
                action,
                values: data,
            }, options);
        });
    }
    static _mapRelationshipsAndFillDownloadUrl(record) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!record) {
                return null;
            }
            const output = record.toObject
                ? record.toObject()
                : record;
            output.evidenciaPago = yield fileRepository_1.default.fillDownloadUrl(output.evidenciaPago);
            return output;
        });
    }
}
exports.default = PagoRepository;
//# sourceMappingURL=pagoRepository.js.map