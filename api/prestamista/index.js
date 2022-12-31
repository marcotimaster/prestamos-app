"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/prestamista`, require('./prestamistaCreate').default);
    app.put(`/tenant/:tenantId/prestamista/:id`, require('./prestamistaUpdate').default);
    app.post(`/tenant/:tenantId/prestamista/import`, require('./prestamistaImport').default);
    app.delete(`/tenant/:tenantId/prestamista`, require('./prestamistaDestroy').default);
    app.get(`/tenant/:tenantId/prestamista/autocomplete`, require('./prestamistaAutocomplete').default);
    app.get(`/tenant/:tenantId/prestamista`, require('./prestamistaList').default);
    app.get(`/tenant/:tenantId/prestamista/:id`, require('./prestamistaFind').default);
};
//# sourceMappingURL=index.js.map