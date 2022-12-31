"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const roles_1 = __importDefault(require("./roles"));
const plans_1 = __importDefault(require("./plans"));
const storage_1 = __importDefault(require("./storage"));
const storage = storage_1.default.values;
const roles = roles_1.default.values;
const plans = plans_1.default.values;
class Permissions {
    static get values() {
        return {
            tenantEdit: {
                id: 'tenantEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            tenantDestroy: {
                id: 'tenantDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            planEdit: {
                id: 'planEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            planRead: {
                id: 'planRead',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            userEdit: {
                id: 'userEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            userDestroy: {
                id: 'userDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            userCreate: {
                id: 'userCreate',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            userImport: {
                id: 'userImport',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            userRead: {
                id: 'userRead',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            userAutocomplete: {
                id: 'userAutocomplete',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            auditLogRead: {
                id: 'auditLogRead',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
            },
            settingsEdit: {
                id: 'settingsEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [
                    plans.free,
                    plans.growth,
                    plans.enterprise,
                ],
                allowedStorage: [
                    storage.settingsBackgroundImages,
                    storage.settingsLogos,
                ],
            },
            prestamistaImport: {
                id: 'prestamistaImport',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            prestamistaCreate: {
                id: 'prestamistaCreate',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            prestamistaEdit: {
                id: 'prestamistaEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            prestamistaDestroy: {
                id: 'prestamistaDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            prestamistaRead: {
                id: 'prestamistaRead',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            prestamistaAutocomplete: {
                id: 'prestamistaAutocomplete',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            tagImport: {
                id: 'tagImport',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            tagCreate: {
                id: 'tagCreate',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            tagEdit: {
                id: 'tagEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            tagDestroy: {
                id: 'tagDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            tagRead: {
                id: 'tagRead',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            tagAutocomplete: {
                id: 'tagAutocomplete',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            deudorImport: {
                id: 'deudorImport',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            deudorCreate: {
                id: 'deudorCreate',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            deudorEdit: {
                id: 'deudorEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            deudorDestroy: {
                id: 'deudorDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            deudorRead: {
                id: 'deudorRead',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            deudorAutocomplete: {
                id: 'deudorAutocomplete',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            contratoPrestamoImport: {
                id: 'contratoPrestamoImport',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            contratoPrestamoCreate: {
                id: 'contratoPrestamoCreate',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [
                    storage.contratoPrestamoFotoFirma,
                ],
            },
            contratoPrestamoEdit: {
                id: 'contratoPrestamoEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [
                    storage.contratoPrestamoFotoFirma,
                ],
            },
            contratoPrestamoDestroy: {
                id: 'contratoPrestamoDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [
                    storage.contratoPrestamoFotoFirma,
                ],
            },
            contratoPrestamoRead: {
                id: 'contratoPrestamoRead',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            contratoPrestamoAutocomplete: {
                id: 'contratoPrestamoAutocomplete',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            pagoImport: {
                id: 'pagoImport',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            pagoCreate: {
                id: 'pagoCreate',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [
                    storage.pagoEvidenciaPago,
                ],
            },
            pagoEdit: {
                id: 'pagoEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [
                    storage.pagoEvidenciaPago,
                ],
            },
            pagoDestroy: {
                id: 'pagoDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [
                    storage.pagoEvidenciaPago,
                ],
            },
            pagoRead: {
                id: 'pagoRead',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            pagoAutocomplete: {
                id: 'pagoAutocomplete',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            fondoImport: {
                id: 'fondoImport',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            fondoCreate: {
                id: 'fondoCreate',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            fondoEdit: {
                id: 'fondoEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            fondoDestroy: {
                id: 'fondoDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            fondoRead: {
                id: 'fondoRead',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            fondoAutocomplete: {
                id: 'fondoAutocomplete',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            aporteImport: {
                id: 'aporteImport',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            aporteCreate: {
                id: 'aporteCreate',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            aporteEdit: {
                id: 'aporteEdit',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            aporteDestroy: {
                id: 'aporteDestroy',
                allowedRoles: [roles.admin],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
                allowedStorage: [],
            },
            aporteRead: {
                id: 'aporteRead',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
            aporteAutocomplete: {
                id: 'aporteAutocomplete',
                allowedRoles: [roles.admin, roles.custom],
                allowedPlans: [plans.free, plans.growth, plans.enterprise],
            },
        };
    }
    static get asArray() {
        return Object.keys(this.values).map((value) => {
            return this.values[value];
        });
    }
}
exports.default = Permissions;
//# sourceMappingURL=permissions.js.map