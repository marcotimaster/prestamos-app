"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/deudor`, require('./deudorCreate').default);
    app.put(`/tenant/:tenantId/deudor/:id`, require('./deudorUpdate').default);
    app.post(`/tenant/:tenantId/deudor/import`, require('./deudorImport').default);
    app.delete(`/tenant/:tenantId/deudor`, require('./deudorDestroy').default);
    app.get(`/tenant/:tenantId/deudor/autocomplete`, require('./deudorAutocomplete').default);
    app.get(`/tenant/:tenantId/deudor`, require('./deudorList').default);
    app.get(`/tenant/:tenantId/deudor/:id`, require('./deudorFind').default);
};
//# sourceMappingURL=index.js.map