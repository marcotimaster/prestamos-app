"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.get('/tenant/:tenantId/contrato-prestamo/download/:id', require('./contratoPrestamoDownload').default);
    app.post('/tenant/:tenantId/contrato-prestamo/notify/:id', require('./contratoPrestamoNotify').default);
    app.post(`/tenant/:tenantId/contrato-prestamo`, require('./contratoPrestamoCreate').default);
    app.put(`/tenant/:tenantId/contrato-prestamo/:id`, require('./contratoPrestamoUpdate').default);
    app.post(`/tenant/:tenantId/contrato-prestamo/import`, require('./contratoPrestamoImport').default);
    app.delete(`/tenant/:tenantId/contrato-prestamo`, require('./contratoPrestamoDestroy').default);
    app.get(`/tenant/:tenantId/contrato-prestamo/autocomplete`, require('./contratoPrestamoAutocomplete').default);
    app.get(`/tenant/:tenantId/contrato-prestamo`, require('./contratoPrestamoList').default);
    app.get(`/tenant/:tenantId/contrato-prestamo/:id`, require('./contratoPrestamoFind').default);
};
//# sourceMappingURL=index.js.map