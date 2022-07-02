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
exports.verifyMedicoByEmail = exports.verifyMedicoByIdentification = exports.loginMedico = exports.createMedico = exports.consultarMedicos = void 0;
const Medico_1 = require("../model/Medico");
const consultarMedicos = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicos = yield Medico_1.Medicos.aggregate([
            {
                $match: { "status": "A" }
            }
        ]);
        return medicos;
    }
    catch (error) {
        return error.message;
    }
});
exports.consultarMedicos = consultarMedicos;
const createMedico = (dataMedico) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medicosSave = yield Medico_1.Medicos.create(dataMedico);
        return medicosSave;
    }
    catch (error) {
        return error.message;
    }
});
exports.createMedico = createMedico;
const loginMedico = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Medico_1.Medicos.findOne({ "email": email, "password": password });
        return data;
    }
    catch (error) {
        return error.message;
    }
});
exports.loginMedico = loginMedico;
const verifyMedicoByIdentification = (identification) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Medico_1.Medicos.findOne({ "identification": identification });
        return data;
    }
    catch (error) {
        return error.message;
    }
});
exports.verifyMedicoByIdentification = verifyMedicoByIdentification;
const verifyMedicoByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield Medico_1.Medicos.findOne({ "email": email });
        if (res != null)
            return res;
        return null;
    }
    catch (error) {
        return error.message;
    }
});
exports.verifyMedicoByEmail = verifyMedicoByEmail;
//# sourceMappingURL=MedicoServices.js.map