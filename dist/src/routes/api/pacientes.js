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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const PacientesServices_1 = require("../../services/PacientesServices");
const router = (0, express_1.Router)();
router.get("/consultar/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listPacientes = yield (0, PacientesServices_1.consultarAllPacientes)();
        if (listPacientes.length === 0) {
            return res.status(400).json({ "message": "No hay informacion disponible" });
        }
        else {
            const resp = listPacientes;
            return res.status(200).json(resp);
        }
    }
    catch (error) {
        return res.status(400).json({ "errorMessage": error.message });
    }
}));
router.get('/consultar/pacientes', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = {
            typeIndicators: req.query.typeIndicators,
            offset: req.query.offset || 1,
            limit: req.query.limit || 10,
            page: req.query.page || 1
        };
        const resListaPacientes = yield (0, PacientesServices_1.listaPacientes)(params);
        return res.status(200).json(resListaPacientes);
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}));
exports.default = router;
//# sourceMappingURL=pacientes.js.map