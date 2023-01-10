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
const contratoPrestamo_1 = __importDefault(require("../models/contratoPrestamo"));
const fileRepository_1 = __importDefault(require("./fileRepository"));
const pago_1 = __importDefault(require("../models/pago"));
const prestamistaRepository_1 = __importDefault(require("./prestamistaRepository"));
const Error400_1 = __importDefault(require("../../errors/Error400"));
const aporteRepository_1 = __importDefault(require("./aporteRepository"));
const deudorRepository_1 = __importDefault(require("./deudorRepository"));
const moment_1 = __importDefault(require("moment"));
const pagoRepository_1 = __importDefault(require("./pagoRepository"));
class ContratoPrestamoRepository {
    static existFondo(prestamistaIds, cantidadSolicitada, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const aportes = yield aporteRepository_1.default.findAndCountAll({ filter: { id: { $in: prestamistaIds } } }, options);
            const fondoTotal = aportes.rows.reduce((total, row) => {
                total += row.prestamista.capitalDisponible;
                return total;
            }, 0);
            return fondoTotal >= cantidadSolicitada;
        });
    }
    static existFondoUpdate(prestamistaIds, prevCantidad, nextCantidad, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const aportes = yield aporteRepository_1.default.findAndCountAll({ filter: { id: { $in: prestamistaIds } } }, options);
            const fondoTotal = aportes.rows.reduce((total, row) => {
                total += row.prestamista.capitalDisponible;
                return total;
            }, 0);
            return (fondoTotal + prevCantidad) >= Number(nextCantidad);
        });
    }
    static findEntity(entity, Repository, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (String(entity).length !== 24) {
                return [entity.id, entity];
            }
            else {
                const newEntity = yield Repository.findById(entity, options);
                return [entity, newEntity];
            }
        });
    }
    static create(data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const currentUser = mongooseRepository_1.default.getCurrentUser(options);
            if (!(yield this.existFondo(data.prestamistas, data.cantidadSolicitada, options))) {
                throw new Error400_1.default(options.language, 'entities.contratoPrestamo.errors.exceed');
            }
            const [record] = yield contratoPrestamo_1.default(options.database).create([
                Object.assign(Object.assign({}, data), { tenant: currentTenant.id, createdBy: currentUser.id, updatedBy: currentUser.id })
            ], options);
            yield this._createAuditLog(auditLogRepository_1.default.CREATE, record.id, data, options);
            yield this.updateCapitalPrestamistas(data.prestamistas, options);
            // await this.updateDeudaDeudor(data.deudor, data.cantidadSolicitada, options);
            return this.findById(record.id, options);
        });
    }
    static updateCapitalPrestamistas(prestamistaIds, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const aportes = yield aporteRepository_1.default.findAndCountAll({ filter: { id: { $in: prestamistaIds } } }, options);
            for (let i = 0; i < aportes.rows.length; i++) {
                const { prestamista, aporte } = aportes.rows[i];
                if (prestamista) {
                    const newCapital = prestamista.capitalDisponible - Number(aporte);
                    yield prestamistaRepository_1.default.update(prestamista.id, Object.assign(Object.assign({}, prestamista), { capitalDisponible: newCapital }), options);
                }
            }
        });
    }
    static updateCapitalPrestamistasChange(prevPrestamistaIds, nextPrestamistaIds, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const prevAportes = yield aporteRepository_1.default.findAndCountAll({ filter: { id: { $in: prevPrestamistaIds } } }, options);
            const capital = [];
            for (let i = 0; i < prevAportes.rows.length; i++) {
                const { prestamista, aporte } = prevAportes.rows[i];
                if (prestamista) {
                    capital.push({ prestamista, aporte });
                    // await PrestamistaRepository.update(prestamista.id, {...prestamista, capitalDisponible: newCapital}, options);
                }
            }
            const nextAportes = yield aporteRepository_1.default.findAndCountAll({ filter: { id: { $in: nextPrestamistaIds } } }, options);
            for (let i = 0; i < nextAportes.rows.length; i++) {
                const { prestamista, aporte } = nextAportes.rows[i];
                if (prestamista) {
                    const { aporte: prevAporte } = capital.find(c => c.prestamista.id === prestamista.id);
                    const newCapital = (prestamista.capitalDisponible + Number(prevAporte)) - Number(aporte);
                    yield prestamistaRepository_1.default.update(prestamista.id, Object.assign(Object.assign({}, prestamista), { capitalDisponible: newCapital }), options);
                }
            }
        });
    }
    static updateDeudaDeudor(deudorId, cantidadSolicitada, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const deudor = yield deudorRepository_1.default.findById(deudorId, options);
            if (deudor) {
                const newCantidad = deudor.deudaPendiente + Number(cantidadSolicitada);
                yield deudorRepository_1.default.update(deudorId, Object.assign(Object.assign({}, deudor), { deudaPendiente: newCantidad }), options);
            }
        });
    }
    static updateDeudaDeudorChange(deudorIdRef, prevCantidadSolicitada, nextCantidadSolicitada, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const [deudorId, deudor] = yield this.findEntity(deudorIdRef, deudorRepository_1.default, options);
            if (deudor) {
                const newCantidad = (deudor.deudaPendiente - Number(prevCantidadSolicitada)) + Number(nextCantidadSolicitada);
                yield deudorRepository_1.default.update(deudorId, Object.assign(Object.assign({}, deudor), { deudaPendiente: newCantidad }), options);
            }
        });
    }
    static update(id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(contratoPrestamo_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            if (!(yield this.existFondoUpdate(data.prestamistas, record.cantidadSolicitada, data.cantidadSolicitada, options))) {
                throw new Error400_1.default(options.language, 'entities.contratoPrestamo.errors.exceed');
            }
            yield contratoPrestamo_1.default(options.database).updateOne({ _id: id }, Object.assign(Object.assign({}, data), { updatedBy: mongooseRepository_1.default.getCurrentUser(options).id }), options);
            yield this._createAuditLog(auditLogRepository_1.default.UPDATE, id, data, options);
            yield this.updateCapitalPrestamistasChange(record.prestamistas, data.prestamistas, options);
            // await this.updateDeudaDeudorChange(data.deudor, record.cantidadSolicitada, data.cantidadSolicitada, options);
            record = yield this.findById(id, options);
            return record;
        });
    }
    static devolutionCapitalPrestamistas(prestamistaIds, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (prestamistaIds) {
                const aportes = yield aporteRepository_1.default.findAndCountAll({ filter: { id: { $in: prestamistaIds } } }, options);
                for (let i = 0; i < aportes.rows.length; i++) {
                    const { prestamista, aporte } = aportes.rows[i];
                    if (prestamista) {
                        const newCapital = prestamista.capitalDisponible + Number(aporte);
                        yield prestamistaRepository_1.default.update(prestamista.id, Object.assign(Object.assign({}, prestamista), { capitalDisponible: newCapital }), options);
                    }
                }
            }
        });
    }
    static devolutionDeudaDeudor(deudorId, cantidadSolicitada, options) {
        return __awaiter(this, void 0, void 0, function* () {
            if (deudorId) {
                const deudor = yield deudorRepository_1.default.findById(deudorId, options);
                if (deudor) {
                    const newCantidad = deudor.deudaPendiente - Number(cantidadSolicitada);
                    yield deudorRepository_1.default.update(deudorId, Object.assign(Object.assign({}, deudor), { deudaPendiente: newCantidad }), options);
                }
            }
        });
    }
    static destroy(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(contratoPrestamo_1.default(options.database).findOne({ _id: id, tenant: currentTenant.id }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            yield contratoPrestamo_1.default(options.database).deleteOne({ _id: id }, options);
            yield this._createAuditLog(auditLogRepository_1.default.DELETE, id, record, options);
            yield this.devolutionCapitalPrestamistas(record.prestamistas, options);
            // await this.devolutionDeudaDeudor(record.deudor, record.cantidadSolicitada, options);
            yield mongooseRepository_1.default.destroyRelationToOne(id, pago_1.default(options.database), 'contratoId', options);
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
            const records = yield contratoPrestamo_1.default(options.database)
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
            return mongooseRepository_1.default.wrapWithSessionIfExists(contratoPrestamo_1.default(options.database).countDocuments(Object.assign(Object.assign({}, filter), { tenant: currentTenant.id })), options);
        });
    }
    static findById(id, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let record = yield mongooseRepository_1.default.wrapWithSessionIfExists(contratoPrestamo_1.default(options.database)
                .findOne({ _id: id, tenant: currentTenant.id })
                .populate({
                path: 'prestamistas',
                populate: {
                    path: 'prestamista',
                    populate: 'tags'
                },
            })
                .populate({
                path: 'deudor',
                populate: 'tags'
            }), options);
            if (!record) {
                throw new Error404_1.default();
            }
            const pagos = yield pagoRepository_1.default.findAndCountAll({ filter: { contratoId: id } }, options);
            return this._mapRelationshipsAndFillDownloadUrl(record, pagos.rows);
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
                if (filter.cantidadSolicitadaRange) {
                    const [start, end] = filter.cantidadSolicitadaRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            cantidadSolicitada: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            cantidadSolicitada: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.interesRange) {
                    const [start, end] = filter.interesRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            interes: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            interes: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.estado) {
                    criteriaAnd.push({
                        estado: filter.estado
                    });
                }
                if (filter.capitalPendienteRange) {
                    const [start, end] = filter.capitalPendienteRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            capitalPendiente: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            capitalPendiente: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.interesPendienteRange) {
                    const [start, end] = filter.interesPendienteRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            interesPendiente: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            interesPendiente: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.capitalPagadoRange) {
                    const [start, end] = filter.capitalPagadoRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            capitalPagado: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            capitalPagado: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.interesPagadoRange) {
                    const [start, end] = filter.interesPagadoRange;
                    if (start !== undefined && start !== null && start !== '') {
                        criteriaAnd.push({
                            interesPagado: {
                                $gte: start,
                            },
                        });
                    }
                    if (end !== undefined && end !== null && end !== '') {
                        criteriaAnd.push({
                            interesPagado: {
                                $lte: end,
                            },
                        });
                    }
                }
                if (filter.observacion) {
                    criteriaAnd.push({
                        observacion: {
                            $regex: mongooseQueryUtils_1.default.escapeRegExp(filter.observacion),
                            $options: 'i',
                        },
                    });
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
            let rows = yield contratoPrestamo_1.default(options.database)
                .find(criteria)
                .skip(skip)
                .limit(limitEscaped)
                .sort(sort)
                .populate({
                path: 'prestamistas',
                populate: {
                    path: 'prestamista',
                    populate: 'tags',
                }
            })
                .populate({
                path: 'deudor',
                populate: 'tags',
            });
            const count = yield contratoPrestamo_1.default(options.database).countDocuments(criteria);
            rows = yield Promise.all(rows.map((row) => __awaiter(this, void 0, void 0, function* () {
                const pagos = yield pagoRepository_1.default.findAndCountAll({ filter: { contratoId: row.id } }, options);
                return this._mapRelationshipsAndFillDownloadUrl(row, pagos.rows);
            })));
            return { rows, count };
        });
    }
    static convertDigitIn(str) {
        return str.split('-').reverse().join('-');
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
            const records = yield contratoPrestamo_1.default(options.database)
                .find(criteria)
                .limit(limitEscaped)
                .sort(sort)
                .populate({
                path: 'prestamistas',
                populate: {
                    path: 'prestamista',
                    populate: 'tags',
                },
            })
                .populate({
                path: 'deudor',
                populate: 'tags',
            });
            const rows = yield Promise.all(records.map((record) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c;
                const pagos = yield pagoRepository_1.default.findAndCountAll({ filter: { contratoId: record.id } }, options);
                const output = yield this._mapRelationshipsAndFillDownloadUrl(record, pagos.rows);
                return {
                    id: record.id,
                    label: `${record.id} - [${record.prestamistas.map(row => { var _a; return `${((_a = row.prestamista) === null || _a === void 0 ? void 0 : _a.nombre) || ''} ${row.prestamista.tags ? row.prestamista.tags.length > 0 ? `(${row.prestamista.tags.map((tag) => tag.tag).join(', ')})` : '' : ''}`; }).join(', ').trim()}] - ${(_a = record.deudor) === null || _a === void 0 ? void 0 : _a.nombre} ${((_c = (_b = record.deudor) === null || _b === void 0 ? void 0 : _b.tags) === null || _c === void 0 ? void 0 : _c.length) > 0 ? `(${record.deudor.tags.map((tag) => tag.tag).join(', ')})` : ''} - ${record.interes}% - S/.${record.cantidadSolicitada} - ${record.fecha ? moment_1.default(this.convertDigitIn(record.fecha)).locale('es').format('MMM D, YYYY') : ''}`,
                    fecha: record.fecha,
                    cantidadSolicitada: record.cantidadSolicitada,
                    interes: record.interes,
                    interesPendiente: output.interesPendiente,
                    mesesPagados: output.mesesPagados,
                    prestamistas: output.prestamistas,
                    deudor: output.deudor,
                };
            })));
            return rows;
        });
    }
    static _createAuditLog(action, id, data, options) {
        return __awaiter(this, void 0, void 0, function* () {
            yield auditLogRepository_1.default.log({
                entityName: contratoPrestamo_1.default(options.database).modelName,
                entityId: id,
                action,
                values: data,
            }, options);
        });
    }
    static _monthDiff(d1, d2) {
        let months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }
    static getTotalInteres(output) {
        const interes = output.interes;
        const cantidadSolicitada = output.cantidadSolicitada;
        const fechaEmision = moment_1.default(ContratoPrestamoRepository.convertDigitIn(output.fecha));
        const fechaActual = moment_1.default();
        const duration = moment_1.default.duration(fechaActual.diff(fechaEmision));
        const dayMonthsMora = 30;
        const months = duration.months();
        const days = duration.days();
        const total = (cantidadSolicitada * (interes / 100)) * months + (((cantidadSolicitada * (interes / 100)) / dayMonthsMora) * days);
        return total;
    }
    static _mapRelationshipsAndFillDownloadUrl(record, pagos = []) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!record) {
                return null;
            }
            const output = record.toObject
                ? record.toObject()
                : record;
            output.fotoFirma = yield fileRepository_1.default.fillDownloadUrl(output.fotoFirma);
            output.capitalPendiente = output.capitalPendiente || output.cantidadSolicitada;
            const totalInteres = ContratoPrestamoRepository.getTotalInteres(output);
            output.interesPendiente = totalInteres - output.interesPagado;
            output.capitalPendiente = output.cantidadSolicitada - output.capitalPagado;
            const mesesPagados = pagos.map((pago) => {
                const { fecha, cantidad } = pago;
                const check = moment_1.default(fecha, 'DD-MM-YYYY');
                const year = check.format('YYYY');
                const mes = check.format('M');
                return { year, mes, cantidad };
            }, []);
            const result = [];
            mesesPagados.reduce(function (acc, value) {
                const key = `${value.mes}-${value.year}`;
                if (!acc[key]) {
                    acc[key] = { year: Number(value.year), mes: Number(value.mes), cantidad: 0 };
                    result.push(acc[key]);
                }
                acc[key].cantidad += value.cantidad;
                return acc;
            }, {});
            output.mesesPagados = result;
            const interes = output.interes;
            const cantidadSolicitada = output.cantidadSolicitada;
            const fechaEmision = moment_1.default(ContratoPrestamoRepository.convertDigitIn(output.fecha));
            const fechaActual = moment_1.default();
            const duration = moment_1.default.duration(fechaActual.diff(fechaEmision));
            const dayMonthsMora = 30;
            const months = duration.months();
            const days = duration.days();
            const mesesPendientes = [];
            for (let i = 0; i < months; i++) {
                const year = fechaEmision.year();
                const mes = fechaEmision.month() + 1;
                const cantidad = result.filter(r => r.year == Number(year) && r.mes == Number(mes) + 1).reduce((acc, r) => acc + r.cantidad, 0);
                const interesMensual = (cantidadSolicitada * (interes / 100));
                const cantidadPendiente = interesMensual - cantidad;
                mesesPendientes.push({
                    year,
                    mes,
                    cantidad: cantidadPendiente,
                });
                fechaEmision.add(1, 'months');
            }
            const year = fechaEmision.year();
            const mes = fechaEmision.month() + 1;
            fechaEmision.add(1, 'months');
            const nextYear = fechaEmision.year();
            const nextMes = fechaEmision.month() + 1;
            const cantidad = result.filter(r => (r.year == Number(year) && r.mes == Number(mes)) || (r.year == Number(nextYear) && r.mes == Number(nextMes))).reduce((acc, r) => acc + r.cantidad, 0);
            const interesDiario = (((cantidadSolicitada * (interes / 100)) / dayMonthsMora) * days);
            const cantidadPendiente = interesDiario - cantidad;
            const mesFound = mesesPendientes[mesesPendientes.length - 1];
            if (cantidadPendiente < 0 && days && mesFound) {
                mesesPendientes.pop();
                mesesPendientes.push({
                    year,
                    mes,
                    days: days,
                    cantidad: mesFound.cantidad + cantidadPendiente,
                });
            }
            else {
                mesesPendientes.push({
                    year,
                    mes,
                    days: days,
                    cantidad: cantidadPendiente,
                });
            }
            output.mesesPagados = output.mesesPagados.map(r => {
                if ((r.year == Number(nextYear) && r.mes == Number(nextMes))) {
                    return Object.assign(Object.assign({}, r), { days });
                }
                return r;
            });
            output.mesesPendientes = mesesPendientes;
            return output;
        });
    }
}
exports.default = ContratoPrestamoRepository;
//# sourceMappingURL=contratoPrestamoRepository.js.map