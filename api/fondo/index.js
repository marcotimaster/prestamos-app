"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (app) => {
    app.post(`/tenant/:tenantId/fondo`, require('./fondoCreate').default);
    app.put(`/tenant/:tenantId/fondo/:id`, require('./fondoUpdate').default);
    app.post(`/tenant/:tenantId/fondo/import`, require('./fondoImport').default);
    app.delete(`/tenant/:tenantId/fondo`, require('./fondoDestroy').default);
    app.get(`/tenant/:tenantId/fondo/autocomplete`, require('./fondoAutocomplete').default);
    app.get(`/tenant/:tenantId/fondo`, require('./fondoList').default);
    app.get(`/tenant/:tenantId/fondo/:id`, require('./fondoFind').default);
};
//# sourceMappingURL=index.js.map