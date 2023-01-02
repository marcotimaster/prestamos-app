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
const mongoose_1 = __importDefault(require("mongoose"));
const contratoPrestamo_1 = __importDefault(require("../models/contratoPrestamo"));
const pago_1 = __importDefault(require("../models/pago"));
const entities = {
    'contratoPrestamo': contratoPrestamo_1.default,
    'pago': pago_1.default,
};
class DashboardRepository {
    static findAndCountAll({ entityName, tipo }, options) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const Entity = entities[entityName];
            if (!Entity) {
                return null;
            }
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            let criteriaAnd = [];
            criteriaAnd.push({
                tenant: mongoose_1.default.Types.ObjectId(currentTenant.id),
            });
            const criteria = criteriaAnd.length
                ? { $and: criteriaAnd }
                : null;
            let count;
            if (entityName === 'contratoPrestamo') {
                count = yield Entity(options.database).aggregate([
                    {
                        $match: criteria,
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: '$cantidadSolicitada' },
                        }
                    }
                ]);
            }
            else if (entityName === 'pago') {
                count = yield Entity(options.database).aggregate([
                    {
                        $match: criteria,
                    },
                    {
                        $group: {
                            _id: null,
                            count: { $sum: '$cantidad' },
                        }
                    }
                ]);
            }
            count = ((_a = count[0]) === null || _a === void 0 ? void 0 : _a.count) || 0;
            return { count };
        });
    }
    static findByLastDate({ entityName, typeOfDate = 'day', limit = 12 }, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const Entity = entities[entityName];
            if (!Entity) {
                return null;
            }
            const currentTenant = mongooseRepository_1.default.getCurrentTenant(options);
            const fieldDate = '$fecha';
            const timezone = '-05:00';
            const yearQuery = {
                year: {
                    $year: { date: fieldDate, timezone }
                }
            };
            const monthQuery = {
                month: {
                    $month: { date: fieldDate, timezone }
                }
            };
            const dayQuery = {
                day: {
                    $dayOfMonth: { date: fieldDate, timezone }
                }
            };
            const query = {
                'day': Object.assign(Object.assign(Object.assign({}, yearQuery), monthQuery), dayQuery),
                'month': Object.assign(Object.assign({}, yearQuery), monthQuery),
                'year': yearQuery
            };
            const yearQueryString = {
                year: {
                    $year: {
                        $dateFromString: { format: '%d-%m-%Y', dateString: fieldDate, timezone }
                    }
                }
            };
            const monthQueryString = {
                month: {
                    $month: {
                        $dateFromString: { format: '%d-%m-%Y', dateString: fieldDate, timezone }
                    }
                }
            };
            const dayQueryString = {
                day: {
                    $dayOfMonth: {
                        $dateFromString: { format: '%d-%m-%Y', dateString: fieldDate, timezone }
                    }
                }
            };
            const queryString = {
                'day': Object.assign(Object.assign(Object.assign({}, yearQueryString), monthQueryString), dayQueryString),
                'month': Object.assign(Object.assign({}, yearQueryString), monthQueryString),
                'year': yearQueryString
            };
            if (!query[typeOfDate]) {
                return null;
            }
            if (!queryString[typeOfDate]) {
                return null;
            }
            let criteriaAnd = [];
            criteriaAnd.push({
                tenant: mongoose_1.default.Types.ObjectId(currentTenant.id),
            });
            const criteria = criteriaAnd.length
                ? { $and: criteriaAnd }
                : null;
            let data = yield Entity(options.database).aggregate([
                {
                    $match: criteria
                },
                {
                    $group: {
                        _id: Object.assign({}, queryString[typeOfDate]),
                        date: {
                            $last: fieldDate,
                        },
                        // withdraws: {
                        //   $push: "$$ROOT"
                        // },
                        count: { $sum: (entityName === 'contratoPrestamo') ? '$cantidadSolicitada' : '$cantidad' },
                    }
                },
                {
                    $sort: {
                        "_id.year": -1,
                        "_id.month": -1,
                        '_id.day': -1
                    }
                },
                {
                    $limit: Number(limit)
                }
            ]);
            return data;
        });
    }
}
exports.default = DashboardRepository;
//# sourceMappingURL=dashboardRepository.js.map