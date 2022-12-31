"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/aporte`, require('./aporteCreate').default);
    app.put(`/tenant/:tenantId/aporte/:id`, require('./aporteUpdate').default);
    app.post(`/tenant/:tenantId/aporte/import`, require('./aporteImport').default);
    app.delete(`/tenant/:tenantId/aporte`, require('./aporteDestroy').default);
    app.get(`/tenant/:tenantId/aporte/autocomplete`, require('./aporteAutocomplete').default);
    app.get(`/tenant/:tenantId/aporte`, require('./aporteList').default);
    app.get(`/tenant/:tenantId/aporte/:id`, require('./aporteFind').default);
};
//# sourceMappingURL=index.js.map