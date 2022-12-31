"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/pago`, require('./pagoCreate').default);
    app.put(`/tenant/:tenantId/pago/:id`, require('./pagoUpdate').default);
    app.post(`/tenant/:tenantId/pago/import`, require('./pagoImport').default);
    app.delete(`/tenant/:tenantId/pago`, require('./pagoDestroy').default);
    app.get(`/tenant/:tenantId/pago/autocomplete`, require('./pagoAutocomplete').default);
    app.get(`/tenant/:tenantId/pago`, require('./pagoList').default);
    app.get(`/tenant/:tenantId/pago/:id`, require('./pagoFind').default);
};
//# sourceMappingURL=index.js.map