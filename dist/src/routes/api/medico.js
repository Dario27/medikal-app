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
const express_1 = require("express");
const config_1 = __importDefault(require("config"));
const Utils_1 = require("../../Utils/Utils");
const MedicoServices_1 = require("../../services/MedicoServices");
const router = (0, express_1.Router)();
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listMedicos = yield (0, MedicoServices_1.consultarMedicos)();
        if (listMedicos.length === 0) {
            return res.status(400).json({ "message": "No hay informacion disponible" });
        }
        else {
            const resp = listMedicos;
            return res.status(200).json(resp);
        }
    }
    catch (error) {
        return res.status(400).json({ "errorMessage": error.message });
    }
}));
router.post("/createmedico", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const email = body['email'];
    const password = body['password'];
    const identification = body['identification'];
    const name = body['name'];
    const lastName = body['lastName'];
    const speciality = body['speciality'];
    const birthDate = body['birthDate'];
    const phone = body['phone'];
    const gender = body['gender'];
    const address = body['address'];
    try {
        const encryptSecretKey = config_1.default.get("key");
        const passwordEncrypt = (0, Utils_1.encrypt)(password, encryptSecretKey);
        const anioNac = new Date(birthDate).getFullYear();
        const anioCurrent = new Date().getFullYear();
        const age = (anioCurrent - anioNac);
        const dataMedico = {
            identification: identification,
            name: name,
            lastName: lastName,
            password: passwordEncrypt,
            specialityID: speciality,
            age: Number(age),
            birthDate: birthDate,
            email: email,
            phone: phone,
            gender: gender,
            address: address
        };
        console.log("dataMedico =>", dataMedico);
        const existsMedico = yield (0, MedicoServices_1.verifyMedicoByIdentification)(identification);
        if (existsMedico === null) {
            const resp = yield (0, MedicoServices_1.createMedico)(dataMedico);
            return res.status(200).json(resp);
        }
        else {
            return res.status(400).json({ "message": "ya existe medico con la cedula ingresada" });
        }
    }
    catch (error) {
        return res.status(400).json(error.message);
    }
}));
exports.default = router;
//# sourceMappingURL=medico.js.map